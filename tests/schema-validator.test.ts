/**
 * Schema Validator Tests
 *
 * 测试基于官方 JSON Schema 的验证
 */

import { describe, it, expect } from 'vitest';
import {
  A2UISchemaValidator,
  validateWithSchema,
  validateClientMessage,
  validateMessagesWithSchema,
} from '../src/validators/schema-validator';

describe('Schema Validator', () => {
  describe('A2UISchemaValidator', () => {
    const validator = new A2UISchemaValidator();

    describe('validateServerToClientMessage', () => {
      it('should validate valid createSurface message', () => {
        const result = validator.validateServerToClientMessage({
          createSurface: {
            surfaceId: 'test-surface',
            catalogId: 'https://a2ui.dev/specification/0.9/standard_catalog_definition.json',
          },
        });
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should reject createSurface without required fields', () => {
        const result = validator.validateServerToClientMessage({
          createSurface: {
            surfaceId: 'test-surface',
            // missing catalogId
          },
        });
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });

      it('should validate valid updateComponents message', () => {
        const result = validator.validateServerToClientMessage({
          updateComponents: {
            surfaceId: 'test-surface',
            components: [
              { id: 'root', component: 'Column', children: ['text1'] },
              { id: 'text1', component: 'Text', text: 'Hello World' },
            ],
          },
        });
        expect(result.valid).toBe(true);
      });

      it('should validate updateDataModel message', () => {
        const result = validator.validateServerToClientMessage({
          updateDataModel: {
            surfaceId: 'test-surface',
            path: '/user',
            op: 'replace',
            value: { name: 'John' },
          },
        });
        expect(result.valid).toBe(true);
      });

      it('should validate deleteSurface message', () => {
        const result = validator.validateServerToClientMessage({
          deleteSurface: {
            surfaceId: 'test-surface',
          },
        });
        expect(result.valid).toBe(true);
      });

      it('should reject invalid message type', () => {
        const result = validator.validateServerToClientMessage({
          invalidMessage: {
            surfaceId: 'test',
          },
        });
        expect(result.valid).toBe(false);
      });
    });

    describe('validateClientToServerMessage', () => {
      it('should validate valid userAction message', () => {
        const result = validator.validateClientToServerMessage({
          userAction: {
            name: 'submitForm',
            surfaceId: 'form-surface',
            sourceComponentId: 'submit-btn',
            timestamp: '2025-01-01T00:00:00Z',
            context: {
              email: 'test@example.com',
            },
          },
        });
        expect(result.valid).toBe(true);
      });

      it('should validate error message', () => {
        const result = validator.validateClientToServerMessage({
          error: {
            code: 'VALIDATION_FAILED',
            surfaceId: 'test-surface',
            path: '/components/0/text',
            message: 'Expected stringOrPath, got integer',
          },
        });
        expect(result.valid).toBe(true);
      });
    });

    describe('validateMessages', () => {
      it('should validate array of messages', () => {
        const result = validator.validateMessages([
          {
            createSurface: {
              surfaceId: 'test',
              catalogId: 'https://a2ui.dev/specification/0.9/standard_catalog_definition.json',
            },
          },
          {
            updateComponents: {
              surfaceId: 'test',
              components: [{ id: 'root', component: 'Text', text: 'Hello' }],
            },
          },
          {
            deleteSurface: {
              surfaceId: 'test',
            },
          },
        ]);
        expect(result.valid).toBe(true);
      });

      it('should report errors with message index', () => {
        const result = validator.validateMessages([
          {
            createSurface: {
              surfaceId: 'test',
              catalogId: 'catalog',
            },
          },
          {
            createSurface: {
              surfaceId: 'test2',
              // missing catalogId
            },
          },
        ]);
        expect(result.valid).toBe(false);
        expect(result.errors.some((e) => e.path.includes('/messages/1'))).toBe(true);
      });
    });
  });

  describe('Convenience functions', () => {
    it('validateWithSchema should work', () => {
      const result = validateWithSchema({
        createSurface: {
          surfaceId: 'test',
          catalogId: 'catalog',
        },
      });
      expect(result.valid).toBe(true);
    });

    it('validateClientMessage should work', () => {
      const result = validateClientMessage({
        userAction: {
          name: 'test',
          surfaceId: 'surface',
          sourceComponentId: 'btn',
          timestamp: new Date().toISOString(),
          context: {},
        },
      });
      expect(result.valid).toBe(true);
    });

    it('validateMessagesWithSchema should work', () => {
      const result = validateMessagesWithSchema([
        {
          deleteSurface: {
            surfaceId: 'test',
          },
        },
      ]);
      expect(result.valid).toBe(true);
    });
  });

  describe('Component validation', () => {
    const validator = new A2UISchemaValidator();

    it('should validate Text component', () => {
      const result = validator.validateServerToClientMessage({
        updateComponents: {
          surfaceId: 'test',
          components: [
            { id: 'text1', component: 'Text', text: 'Hello' },
            { id: 'text2', component: 'Text', text: { path: '/greeting' } },
            { id: 'text3', component: 'Text', text: 'Title', usageHint: 'h1' },
          ],
        },
      });
      expect(result.valid).toBe(true);
    });

    it('should validate Button component', () => {
      const result = validator.validateServerToClientMessage({
        updateComponents: {
          surfaceId: 'test',
          components: [
            {
              id: 'btn1',
              component: 'Button',
              child: 'label1',
              action: { name: 'submit' },
            },
            {
              id: 'btn2',
              component: 'Button',
              child: 'label2',
              action: {
                name: 'submitWithContext',
                context: {
                  userId: '123',
                  email: { path: '/form/email' },
                },
              },
              primary: true,
            },
            { id: 'label1', component: 'Text', text: 'Submit' },
            { id: 'label2', component: 'Text', text: 'Send' },
          ],
        },
      });
      expect(result.valid).toBe(true);
    });

    it('should validate layout components', () => {
      const result = validator.validateServerToClientMessage({
        updateComponents: {
          surfaceId: 'test',
          components: [
            {
              id: 'root',
              component: 'Column',
              children: ['row1', 'divider', 'list1'],
            },
            {
              id: 'row1',
              component: 'Row',
              children: ['text1', 'text2'],
              distribution: 'spaceBetween',
            },
            { id: 'divider', component: 'Divider', axis: 'horizontal' },
            {
              id: 'list1',
              component: 'List',
              children: { componentId: 'item', path: '/items' },
              direction: 'vertical',
            },
            { id: 'item', component: 'Text', text: { path: 'name' } },
            { id: 'text1', component: 'Text', text: 'Left' },
            { id: 'text2', component: 'Text', text: 'Right' },
          ],
        },
      });
      expect(result.valid).toBe(true);
    });

    it('should validate input components', () => {
      const result = validator.validateServerToClientMessage({
        updateComponents: {
          surfaceId: 'test',
          components: [
            {
              id: 'textField1',
              component: 'TextField',
              label: 'Name',
              text: { path: '/form/name' },
              usageHint: 'shortText',
            },
            {
              id: 'checkbox1',
              component: 'CheckBox',
              label: 'Agree',
              value: { path: '/form/agreed' },
            },
            {
              id: 'slider1',
              component: 'Slider',
              label: 'Volume',
              min: 0,
              max: 100,
              value: { path: '/settings/volume' },
            },
            {
              id: 'choice1',
              component: 'ChoicePicker',
              options: [
                { label: 'Option A', value: 'a' },
                { label: 'Option B', value: 'b' },
              ],
              value: { path: '/form/choice' },
              usageHint: 'mutuallyExclusive',
            },
          ],
        },
      });
      expect(result.valid).toBe(true);
    });
  });
});

