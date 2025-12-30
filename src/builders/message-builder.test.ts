/**
 * Message Builder Tests
 */

import { describe, it, expect } from 'vitest';
import {
  createSurface,
  updateComponents,
  updateDataModel,
  deleteSurface,
  createV09Messages,
  beginRendering,
  surfaceUpdate,
  dataModelInit,
  createV08Messages,
  messagesToJsonl,
  jsonlToMessages,
} from './message-builder';
import { STANDARD_CATALOG_ID } from '../types';

describe('Message Builder', () => {
  describe('v0.9 messages', () => {
    describe('createSurface', () => {
      it('should create surface message with default catalog', () => {
        const msg = createSurface('my-surface');
        expect(msg).toEqual({
          createSurface: {
            surfaceId: 'my-surface',
            catalogId: STANDARD_CATALOG_ID,
          },
        });
      });

      it('should use custom catalog', () => {
        const msg = createSurface('my-surface', 'https://custom.catalog.json');
        expect(msg.createSurface.catalogId).toBe('https://custom.catalog.json');
      });
    });

    describe('updateComponents', () => {
      it('should create update components message', () => {
        const components = [
          { id: 'root', component: 'Column', children: ['text1'] },
          { id: 'text1', component: 'Text', text: 'Hello' },
        ];
        const msg = updateComponents('my-surface', components);
        expect(msg).toEqual({
          updateComponents: {
            surfaceId: 'my-surface',
            components,
          },
        });
      });
    });

    describe('updateDataModel', () => {
      it('should create data model update with replace', () => {
        const msg = updateDataModel('my-surface', { name: 'John' });
        expect(msg).toEqual({
          updateDataModel: {
            surfaceId: 'my-surface',
            op: 'replace',
            value: { name: 'John' },
          },
        });
      });

      it('should include path when specified', () => {
        const msg = updateDataModel('my-surface', 'John', '/user/name');
        expect(msg.updateDataModel.path).toBe('/user/name');
      });

      it('should support remove operation', () => {
        const msg = updateDataModel('my-surface', undefined, '/user/temp', 'remove');
        expect(msg.updateDataModel.op).toBe('remove');
        expect(msg.updateDataModel.value).toBeUndefined();
      });
    });

    describe('deleteSurface', () => {
      it('should create delete surface message', () => {
        const msg = deleteSurface('my-surface');
        expect(msg).toEqual({
          deleteSurface: {
            surfaceId: 'my-surface',
          },
        });
      });
    });

    describe('createV09Messages', () => {
      it('should create complete message sequence', () => {
        const messages = createV09Messages({
          surfaceId: 'test-surface',
          components: [
            { id: 'root', component: 'Text', text: 'Hello' },
          ],
          dataModel: { greeting: 'Hello World' },
        });

        expect(messages).toHaveLength(3);
        expect('createSurface' in messages[0]).toBe(true);
        expect('updateComponents' in messages[1]).toBe(true);
        expect('updateDataModel' in messages[2]).toBe(true);
      });

      it('should omit dataModel message when not provided', () => {
        const messages = createV09Messages({
          surfaceId: 'test-surface',
          components: [
            { id: 'root', component: 'Text', text: 'Hello' },
          ],
        });

        expect(messages).toHaveLength(2);
      });
    });
  });

  describe('v0.8 messages', () => {
    describe('beginRendering', () => {
      it('should create begin rendering message', () => {
        const msg = beginRendering('root-component', 'my-surface');
        expect(msg).toEqual({
          beginRendering: {
            surfaceId: 'my-surface',
            root: 'root-component',
          },
        });
      });

      it('should include styles when provided', () => {
        const msg = beginRendering('root', 'surface', { primaryColor: '#ff0000' });
        expect(msg.beginRendering.styles).toEqual({ primaryColor: '#ff0000' });
      });
    });

    describe('surfaceUpdate', () => {
      it('should create surface update message', () => {
        const components = [
          { id: 'root', component: { Column: { children: { explicitList: ['text1'] } } } },
        ];
        const msg = surfaceUpdate(components, 'my-surface');
        expect(msg).toEqual({
          surfaceUpdate: {
            surfaceId: 'my-surface',
            components,
          },
        });
      });
    });

    describe('dataModelInit', () => {
      it('should create data model init message', () => {
        const msg = dataModelInit({ name: 'John', age: 30 }, 'my-surface');
        expect(msg.dataModelUpdate.surfaceId).toBe('my-surface');
        expect(msg.dataModelUpdate.contents).toHaveLength(2);
      });
    });

    describe('createV08Messages', () => {
      it('should create complete v0.8 message sequence', () => {
        const messages = createV08Messages({
          rootId: 'root',
          components: [
            { id: 'root', component: { Text: { text: { literalString: 'Hello' } } } },
          ],
          dataModel: { greeting: 'Hello' },
          surfaceId: 'test-surface',
          styles: { primaryColor: '#0000ff' },
        });

        expect(messages).toHaveLength(3);
        expect('surfaceUpdate' in messages[0]).toBe(true);
        expect('dataModelUpdate' in messages[1]).toBe(true);
        expect('beginRendering' in messages[2]).toBe(true);
      });
    });
  });

  describe('JSONL utilities', () => {
    it('should convert messages to JSONL', () => {
      const messages = [
        createSurface('surface1'),
        deleteSurface('surface1'),
      ];
      const jsonl = messagesToJsonl(messages);
      const lines = jsonl.split('\n');
      expect(lines).toHaveLength(2);
      expect(JSON.parse(lines[0])).toEqual(messages[0]);
      expect(JSON.parse(lines[1])).toEqual(messages[1]);
    });

    it('should parse JSONL to messages', () => {
      const jsonl = '{"createSurface":{"surfaceId":"s1","catalogId":"c1"}}\n{"deleteSurface":{"surfaceId":"s1"}}';
      const messages = jsonlToMessages(jsonl);
      expect(messages).toHaveLength(2);
      expect('createSurface' in messages[0]).toBe(true);
      expect('deleteSurface' in messages[1]).toBe(true);
    });

    it('should handle empty lines in JSONL', () => {
      const jsonl = '{"createSurface":{"surfaceId":"s1","catalogId":"c1"}}\n\n{"deleteSurface":{"surfaceId":"s1"}}';
      const messages = jsonlToMessages(jsonl);
      expect(messages).toHaveLength(2);
    });
  });
});

