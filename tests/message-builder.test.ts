/**
 * Message Builder Tests - v0.9
 */

import { describe, it, expect } from 'vitest';
import {
  createSurface,
  updateComponents,
  updateDataModel,
  deleteSurface,
  createV09Messages,
  messagesToJsonl,
  jsonlToMessages,
} from '../src/builders/message-builder';
import { STANDARD_CATALOG_ID } from '../src/types';

describe('Message Builder v0.9', () => {
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

    it('should support add operation', () => {
      const msg = updateDataModel('my-surface', { newField: 123 }, '/user', 'add');
      expect(msg.updateDataModel.op).toBe('add');
      expect(msg.updateDataModel.value).toEqual({ newField: 123 });
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
        components: [{ id: 'root', component: 'Text', text: 'Hello' }],
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
        components: [{ id: 'root', component: 'Text', text: 'Hello' }],
      });

      expect(messages).toHaveLength(2);
    });

    it('should use custom catalogId', () => {
      const customCatalog = 'https://custom.example.com/catalog.json';
      const messages = createV09Messages({
        surfaceId: 'test-surface',
        components: [{ id: 'root', component: 'Text', text: 'Hello' }],
        catalogId: customCatalog,
      });

      const createMsg = messages[0] as { createSurface: { catalogId: string } };
      expect(createMsg.createSurface.catalogId).toBe(customCatalog);
    });
  });

  describe('JSONL utilities', () => {
    it('should convert messages to JSONL', () => {
      const messages = [createSurface('surface1'), deleteSurface('surface1')];
      const jsonl = messagesToJsonl(messages);
      const lines = jsonl.split('\n');
      expect(lines).toHaveLength(2);
      expect(JSON.parse(lines[0])).toEqual(messages[0]);
      expect(JSON.parse(lines[1])).toEqual(messages[1]);
    });

    it('should parse JSONL to messages', () => {
      const jsonl =
        '{"createSurface":{"surfaceId":"s1","catalogId":"c1"}}\n{"deleteSurface":{"surfaceId":"s1"}}';
      const messages = jsonlToMessages(jsonl);
      expect(messages).toHaveLength(2);
      expect('createSurface' in messages[0]).toBe(true);
      expect('deleteSurface' in messages[1]).toBe(true);
    });

    it('should handle empty lines in JSONL', () => {
      const jsonl =
        '{"createSurface":{"surfaceId":"s1","catalogId":"c1"}}\n\n{"deleteSurface":{"surfaceId":"s1"}}';
      const messages = jsonlToMessages(jsonl);
      expect(messages).toHaveLength(2);
    });
  });
});
