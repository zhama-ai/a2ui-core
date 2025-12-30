/**
 * Message Validator Tests - v0.9
 */

import { describe, it, expect } from 'vitest';
import { validateMessage, validateMessages, validateV09Message } from '../src/validators/message-validator';

describe('Message Validator v0.9', () => {
  describe('validateV09Message', () => {
    it('should validate valid createSurface message', () => {
      const result = validateV09Message({
        createSurface: {
          surfaceId: 'test-surface',
          catalogId: 'https://example.com/catalog.json',
        },
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should report missing surfaceId in createSurface', () => {
      const result = validateV09Message({
        createSurface: {
          surfaceId: '',
          catalogId: 'https://example.com/catalog.json',
        },
      });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === 'MISSING_SURFACE_ID')).toBe(true);
    });

    it('should report missing catalogId in createSurface', () => {
      const result = validateV09Message({
        createSurface: {
          surfaceId: 'test-surface',
          catalogId: '',
        },
      });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === 'MISSING_CATALOG_ID')).toBe(true);
    });

    it('should validate valid updateComponents message', () => {
      const result = validateV09Message({
        updateComponents: {
          surfaceId: 'test-surface',
          components: [
            { id: 'root', component: 'Column', children: ['text1'] },
            { id: 'text1', component: 'Text', text: 'Hello' },
          ],
        },
      });
      expect(result.valid).toBe(true);
    });

    it('should report duplicate component IDs', () => {
      const result = validateV09Message({
        updateComponents: {
          surfaceId: 'test-surface',
          components: [
            { id: 'same-id', component: 'Text', text: 'First' },
            { id: 'same-id', component: 'Text', text: 'Second' },
          ],
        },
      });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === 'DUPLICATE_COMPONENT_ID')).toBe(true);
    });

    it('should report missing component ID', () => {
      const result = validateV09Message({
        updateComponents: {
          surfaceId: 'test-surface',
          components: [{ id: '', component: 'Text', text: 'No ID' }],
        },
      });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === 'MISSING_COMPONENT_ID')).toBe(true);
    });

    it('should report missing component type', () => {
      const result = validateV09Message({
        updateComponents: {
          surfaceId: 'test-surface',
          components: [{ id: 'comp1', component: '' }],
        },
      });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === 'MISSING_COMPONENT_TYPE')).toBe(true);
    });

    it('should validate updateDataModel message', () => {
      const result = validateV09Message({
        updateDataModel: {
          surfaceId: 'test-surface',
          value: { name: 'John' },
        },
      });
      expect(result.valid).toBe(true);
    });

    it('should validate updateDataModel with path and op', () => {
      const result = validateV09Message({
        updateDataModel: {
          surfaceId: 'test-surface',
          path: '/user/name',
          op: 'replace',
          value: 'Jane',
        },
      });
      expect(result.valid).toBe(true);
    });

    it('should report invalid op in updateDataModel', () => {
      const result = validateV09Message({
        updateDataModel: {
          surfaceId: 'test-surface',
          op: 'invalid' as 'add',
          value: 'test',
        },
      });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === 'INVALID_OP')).toBe(true);
    });

    it('should warn about unnecessary value for remove operation', () => {
      const result = validateV09Message({
        updateDataModel: {
          surfaceId: 'test-surface',
          path: '/user',
          op: 'remove',
          value: 'should-not-be-here',
        },
      });
      expect(result.valid).toBe(true); // Still valid, just warning
      expect(result.warnings.some((w) => w.code === 'UNNECESSARY_VALUE')).toBe(true);
    });

    it('should validate deleteSurface message', () => {
      const result = validateV09Message({
        deleteSurface: {
          surfaceId: 'test-surface',
        },
      });
      expect(result.valid).toBe(true);
    });

    it('should report missing surfaceId in deleteSurface', () => {
      const result = validateV09Message({
        deleteSurface: {
          surfaceId: '',
        },
      });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === 'MISSING_SURFACE_ID')).toBe(true);
    });
  });

  describe('validateMessage', () => {
    it('should validate createSurface message', () => {
      const result = validateMessage({
        createSurface: {
          surfaceId: 'test',
          catalogId: 'catalog',
        },
      });
      expect(result.valid).toBe(true);
    });

    it('should validate updateComponents message', () => {
      const result = validateMessage({
        updateComponents: {
          surfaceId: 'test',
          components: [{ id: 'root', component: 'Text', text: 'Hello' }],
        },
      });
      expect(result.valid).toBe(true);
    });

    it('should validate deleteSurface message', () => {
      const result = validateMessage({
        deleteSurface: {
          surfaceId: 'test',
        },
      });
      expect(result.valid).toBe(true);
    });
  });

  describe('validateMessages', () => {
    it('should validate array of messages', () => {
      const result = validateMessages([
        { createSurface: { surfaceId: 's1', catalogId: 'c1' } },
        {
          updateComponents: {
            surfaceId: 's1',
            components: [{ id: 'root', component: 'Text', text: 'Hi' }],
          },
        },
        { updateDataModel: { surfaceId: 's1', value: { test: 123 } } },
        { deleteSurface: { surfaceId: 's1' } },
      ]);
      expect(result.valid).toBe(true);
    });

    it('should include message index in error path', () => {
      const result = validateMessages([
        { createSurface: { surfaceId: 's1', catalogId: 'c1' } },
        { updateComponents: { surfaceId: '', components: [] } },
      ]);
      expect(result.valid).toBe(false);
      expect(result.errors[0]?.path).toContain('messages[1]');
    });

    it('should report all errors from multiple messages', () => {
      const result = validateMessages([
        { createSurface: { surfaceId: '', catalogId: '' } },
        { deleteSurface: { surfaceId: '' } },
      ]);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('strict mode', () => {
    it('should warn about missing root component in strict mode', () => {
      const result = validateV09Message(
        {
          updateComponents: {
            surfaceId: 'test',
            components: [{ id: 'not-root', component: 'Text', text: 'Hello' }],
          },
        },
        { strict: true }
      );
      expect(result.valid).toBe(true);
      expect(result.warnings.some((w) => w.code === 'MISSING_ROOT_COMPONENT')).toBe(true);
    });
  });
});
