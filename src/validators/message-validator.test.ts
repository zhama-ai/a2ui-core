/**
 * Message Validator Tests
 */

import { describe, it, expect } from 'vitest';
import {
  validateMessage,
  validateMessages,
  validateV09Message,
  validateV08Message,
} from './message-validator';

describe('Message Validator', () => {
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
      expect(result.errors.some(e => e.code === 'MISSING_SURFACE_ID')).toBe(true);
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
      expect(result.errors.some(e => e.code === 'DUPLICATE_COMPONENT_ID')).toBe(true);
    });

    it('should report missing component ID', () => {
      const result = validateV09Message({
        updateComponents: {
          surfaceId: 'test-surface',
          components: [
            { id: '', component: 'Text', text: 'No ID' },
          ],
        },
      });
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'MISSING_COMPONENT_ID')).toBe(true);
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

    it('should validate deleteSurface message', () => {
      const result = validateV09Message({
        deleteSurface: {
          surfaceId: 'test-surface',
        },
      });
      expect(result.valid).toBe(true);
    });
  });

  describe('validateV08Message', () => {
    it('should validate valid beginRendering message', () => {
      const result = validateV08Message({
        beginRendering: {
          surfaceId: 'test-surface',
          root: 'root-component',
        },
      });
      expect(result.valid).toBe(true);
    });

    it('should report missing root in beginRendering', () => {
      const result = validateV08Message({
        beginRendering: {
          surfaceId: 'test-surface',
          root: '',
        },
      });
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === 'MISSING_ROOT')).toBe(true);
    });

    it('should validate surfaceUpdate message', () => {
      const result = validateV08Message({
        surfaceUpdate: {
          surfaceId: 'test-surface',
          components: [
            { id: 'root', component: { Text: { text: { literalString: 'Hello' } } } },
          ],
        },
      });
      expect(result.valid).toBe(true);
    });

    it('should validate dataModelUpdate message', () => {
      const result = validateV08Message({
        dataModelUpdate: {
          surfaceId: 'test-surface',
          contents: [
            { key: '/name', valueString: 'John' },
          ],
        },
      });
      expect(result.valid).toBe(true);
    });
  });

  describe('validateMessage (auto-detect)', () => {
    it('should detect and validate v0.9 message', () => {
      const result = validateMessage({
        createSurface: {
          surfaceId: 'test',
          catalogId: 'catalog',
        },
      });
      expect(result.valid).toBe(true);
    });

    it('should detect and validate v0.8 message', () => {
      const result = validateMessage({
        beginRendering: {
          surfaceId: 'test',
          root: 'root',
        },
      });
      expect(result.valid).toBe(true);
    });
  });

  describe('validateMessages', () => {
    it('should validate array of messages', () => {
      const result = validateMessages([
        { createSurface: { surfaceId: 's1', catalogId: 'c1' } },
        { updateComponents: { surfaceId: 's1', components: [] } },
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
      expect(result.errors[0].path).toContain('messages[1]');
    });
  });
});

