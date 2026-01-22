/**
 * Message Validator Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  validateMessage,
  validateMessages,
} from '../src/validators/message-validator';
import {
  createSurface,
  updateComponents,
  updateDataModel,
  deleteSurface,
} from '../src/builders/message-builder';
import { text, column, button, slider, modal, eventAction } from '../src/builders/component-builder';
import { resetIdCounter } from '../src/builders/id-generator';
import type { ServerToClientMessage } from '../src/types';

describe('Message Validator', () => {
  beforeEach(() => {
    resetIdCounter();
  });

  describe('validateMessage', () => {
    describe('createSurface', () => {
      it('should validate valid createSurface message', () => {
        const msg = createSurface('my-surface');
        const result = validateMessage(msg);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should error on missing surfaceId', () => {
        const msg = { createSurface: { catalogId: 'test' } } as unknown as ServerToClientMessage;
        const result = validateMessage(msg);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ code: 'MISSING_SURFACE_ID' })
        );
      });

      it('should error on missing catalogId', () => {
        const msg = { createSurface: { surfaceId: 'test' } } as unknown as ServerToClientMessage;
        const result = validateMessage(msg);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ code: 'MISSING_CATALOG_ID' })
        );
      });

      it('should warn on invalid primaryColor format', () => {
        const msg = createSurface('test', { theme: { primaryColor: 'invalid' } });
        const result = validateMessage(msg);
        expect(result.valid).toBe(true);
        expect(result.warnings).toContainEqual(
          expect.objectContaining({ code: 'INVALID_PRIMARY_COLOR' })
        );
      });
    });

    describe('updateComponents', () => {
      it('should validate valid updateComponents message', () => {
        const msg = updateComponents('my-surface', [
          column(['title'], { id: 'root' }),
          text('Hello', { id: 'title' }),
        ]);
        const result = validateMessage(msg);
        expect(result.valid).toBe(true);
      });

      it('should error on missing surfaceId', () => {
        const msg = {
          updateComponents: { components: [] },
        } as unknown as ServerToClientMessage;
        const result = validateMessage(msg);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ code: 'MISSING_SURFACE_ID' })
        );
      });

      it('should error on invalid components type', () => {
        const msg = {
          updateComponents: { surfaceId: 'test', components: 'invalid' },
        } as unknown as ServerToClientMessage;
        const result = validateMessage(msg);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ code: 'INVALID_COMPONENTS' })
        );
      });

      it('should error on duplicate component ids', () => {
        const msg = updateComponents('my-surface', [
          text('Hello', { id: 'same-id' }),
          text('World', { id: 'same-id' }),
        ]);
        const result = validateMessage(msg);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ code: 'DUPLICATE_COMPONENT_ID' })
        );
      });

      it('should warn on missing root component in strict mode', () => {
        const msg = updateComponents('my-surface', [
          text('Hello', { id: 'not-root' }),
        ]);
        const result = validateMessage(msg, { strict: true });
        expect(result.warnings).toContainEqual(
          expect.objectContaining({ code: 'MISSING_ROOT_COMPONENT' })
        );
      });

      it('should warn on unknown component type in strict mode', () => {
        const msg = updateComponents('my-surface', [
          { id: 'custom', component: 'CustomWidget' },
        ]);
        const result = validateMessage(msg, { strict: true });
        expect(result.warnings).toContainEqual(
          expect.objectContaining({ code: 'UNKNOWN_COMPONENT_TYPE' })
        );
      });
    });

    describe('updateDataModel', () => {
      it('should validate valid updateDataModel message', () => {
        const msg = updateDataModel('my-surface', { user: 'John' });
        const result = validateMessage(msg);
        expect(result.valid).toBe(true);
      });

      it('should error on missing surfaceId', () => {
        const msg = {
          updateDataModel: { value: {} },
        } as unknown as ServerToClientMessage;
        const result = validateMessage(msg);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ code: 'MISSING_SURFACE_ID' })
        );
      });
    });

    describe('deleteSurface', () => {
      it('should validate valid deleteSurface message', () => {
        const msg = deleteSurface('my-surface');
        const result = validateMessage(msg);
        expect(result.valid).toBe(true);
      });

      it('should error on missing surfaceId', () => {
        const msg = { deleteSurface: {} } as unknown as ServerToClientMessage;
        const result = validateMessage(msg);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ code: 'MISSING_SURFACE_ID' })
        );
      });
    });

    describe('invalid message type', () => {
      it('should error on unknown message type', () => {
        const msg = { unknownType: {} } as unknown as ServerToClientMessage;
        const result = validateMessage(msg);
        expect(result.valid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({ code: 'INVALID_MESSAGE_TYPE' })
        );
      });
    });
  });

  describe('validateMessages', () => {
    it('should validate array of messages', () => {
      const messages = [
        createSurface('my-surface'),
        updateComponents('my-surface', [text('Hello', { id: 'root' })]),
        updateDataModel('my-surface', { count: 1 }),
        deleteSurface('my-surface'),
      ];
      const result = validateMessages(messages);
      expect(result.valid).toBe(true);
    });

    it('should collect errors from all messages', () => {
      const messages: ServerToClientMessage[] = [
        { createSurface: { surfaceId: '' } } as unknown as ServerToClientMessage,
        { updateComponents: { surfaceId: '' } } as unknown as ServerToClientMessage,
      ];
      const result = validateMessages(messages);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Component property validation', () => {
    it('should validate required properties for Text', () => {
      const msg = updateComponents('test', [
        { id: 'text1', component: 'Text' },
      ]);
      const result = validateMessage(msg);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'MISSING_REQUIRED_PROPERTY',
          message: expect.stringContaining('text'),
        })
      );
    });

    it('should validate required properties for Button', () => {
      const msg = updateComponents('test', [
        { id: 'btn1', component: 'Button' },
      ]);
      const result = validateMessage(msg);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'MISSING_REQUIRED_PROPERTY',
          message: expect.stringContaining('child'),
        })
      );
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'MISSING_REQUIRED_PROPERTY',
          message: expect.stringContaining('action'),
        })
      );
    });

    it('should validate required properties for Slider (min/max required)', () => {
      const msg = updateComponents('test', [
        { id: 'slider1', component: 'Slider', value: 50 },
      ]);
      const result = validateMessage(msg);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'MISSING_REQUIRED_PROPERTY',
          message: expect.stringContaining('min'),
        })
      );
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'MISSING_REQUIRED_PROPERTY',
          message: expect.stringContaining('max'),
        })
      );
    });

    it('should validate required properties for Modal (trigger/content)', () => {
      const msg = updateComponents('test', [
        { id: 'modal1', component: 'Modal' },
      ]);
      const result = validateMessage(msg);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'MISSING_REQUIRED_PROPERTY',
          message: expect.stringContaining('trigger'),
        })
      );
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'MISSING_REQUIRED_PROPERTY',
          message: expect.stringContaining('content'),
        })
      );
    });

    it('should validate required properties for Tabs (tabs array)', () => {
      const msg = updateComponents('test', [
        { id: 'tabs1', component: 'Tabs' },
      ]);
      const result = validateMessage(msg);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: 'MISSING_REQUIRED_PROPERTY',
          message: expect.stringContaining('tabs'),
        })
      );
    });

    it('should pass validation for properly formed components', () => {
      const msg = updateComponents('test', [
        text('Hello', { id: 'text1' }),
        button('text1', eventAction('click'), { id: 'btn1' }),
        slider(50, 0, 100, { id: 'slider1' }),
        modal('btn1', 'text1', { id: 'modal1' }),
      ]);
      const result = validateMessage(msg);
      expect(result.valid).toBe(true);
    });
  });
});
