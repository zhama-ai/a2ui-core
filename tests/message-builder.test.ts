/**
 * Message Builder Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  createSurface,
  updateComponents,
  updateDataModel,
  deleteSurface,
  createMessages,
  messagesToJsonl,
  jsonlToMessages,
} from '../src/builders/message-builder';
import { text, column, button, eventAction, h1 } from '../src/builders/component-builder';
import { resetIdCounter } from '../src/builders/id-generator';
import { STANDARD_CATALOG_ID } from '../src/types';

describe('Message Builder', () => {
  beforeEach(() => {
    resetIdCounter();
  });

  describe('createSurface', () => {
    it('should create surface with default catalog', () => {
      const msg = createSurface('my-surface');
      expect(msg).toEqual({
        createSurface: {
          surfaceId: 'my-surface',
          catalogId: STANDARD_CATALOG_ID,
        },
      });
    });

    it('should create surface with custom catalog', () => {
      const customCatalog = 'https://example.com/catalog.json';
      const msg = createSurface('my-surface', { catalogId: customCatalog });
      expect(msg.createSurface.catalogId).toBe(customCatalog);
    });

    it('should create surface with theme', () => {
      const msg = createSurface('my-surface', {
        theme: {
          primaryColor: '#FF5733',
          iconUrl: 'https://example.com/icon.png',
        },
      });
      expect(msg.createSurface.theme).toEqual({
        primaryColor: '#FF5733',
        iconUrl: 'https://example.com/icon.png',
      });
    });

    it('should create surface with sendDataModel flag', () => {
      const msg = createSurface('my-surface', { sendDataModel: true });
      expect(msg.createSurface.sendDataModel).toBe(true);
    });
  });

  describe('updateComponents', () => {
    it('should create update components message', () => {
      const components = [
        text('Hello', { id: 'text1' }),
        column(['text1'], { id: 'root' }),
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
    it('should create data model update with value only', () => {
      const msg = updateDataModel('my-surface', { user: 'John' });
      expect(msg).toEqual({
        updateDataModel: {
          surfaceId: 'my-surface',
          value: { user: 'John' },
        },
      });
    });

    it('should create data model update with path', () => {
      const msg = updateDataModel('my-surface', 'Jane', '/user/name');
      expect(msg).toEqual({
        updateDataModel: {
          surfaceId: 'my-surface',
          path: '/user/name',
          value: 'Jane',
        },
      });
    });

    it('should create data model delete (no value)', () => {
      const msg = updateDataModel('my-surface', undefined, '/user/temp');
      expect(msg).toEqual({
        updateDataModel: {
          surfaceId: 'my-surface',
          path: '/user/temp',
        },
      });
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

  describe('createMessages', () => {
    it('should create message sequence without data model', () => {
      const title = h1('Welcome', { id: 'title' });
      const root = column(['title'], { id: 'root' });

      const messages = createMessages({
        surfaceId: '@chat',
        components: [title, root],
      });

      expect(messages).toHaveLength(2);
      expect(messages[0]).toHaveProperty('createSurface');
      expect(messages[1]).toHaveProperty('updateComponents');
    });

    it('should create message sequence with data model', () => {
      const title = h1('Welcome', { id: 'title' });
      const root = column(['title'], { id: 'root' });

      const messages = createMessages({
        surfaceId: '@chat',
        components: [title, root],
        dataModel: { user: { name: 'John' } },
      });

      expect(messages).toHaveLength(3);
      expect(messages[0]).toHaveProperty('createSurface');
      expect(messages[1]).toHaveProperty('updateComponents');
      expect(messages[2]).toHaveProperty('updateDataModel');
    });

    it('should create message sequence with all options', () => {
      const title = h1('Welcome', { id: 'title' });
      const root = column(['title'], { id: 'root' });

      const messages = createMessages({
        surfaceId: '@chat',
        catalogId: 'https://example.com/catalog.json',
        theme: { primaryColor: '#00BFFF' },
        sendDataModel: true,
        components: [title, root],
        dataModel: { user: { name: 'John' } },
      });

      expect(messages).toHaveLength(3);
      const createMsg = messages[0] as { createSurface: { catalogId: string; theme: object; sendDataModel: boolean } };
      expect(createMsg.createSurface.catalogId).toBe('https://example.com/catalog.json');
      expect(createMsg.createSurface.theme).toEqual({ primaryColor: '#00BFFF' });
      expect(createMsg.createSurface.sendDataModel).toBe(true);
    });
  });

  describe('JSONL utilities', () => {
    it('should convert messages to JSONL', () => {
      const messages = createMessages({
        surfaceId: 'test',
        components: [text('Hello', { id: 'root' })],
      });

      const jsonl = messagesToJsonl(messages);
      const lines = jsonl.split('\n');

      expect(lines).toHaveLength(2);
      expect(() => JSON.parse(lines[0])).not.toThrow();
      expect(() => JSON.parse(lines[1])).not.toThrow();
    });

    it('should parse JSONL to messages', () => {
      const original = createMessages({
        surfaceId: 'test',
        components: [text('Hello', { id: 'root' })],
      });

      const jsonl = messagesToJsonl(original);
      const parsed = jsonlToMessages(jsonl);

      expect(parsed).toHaveLength(original.length);
      expect(parsed[0]).toHaveProperty('createSurface');
      expect(parsed[1]).toHaveProperty('updateComponents');
    });

    it('should handle empty lines in JSONL', () => {
      const jsonl = '{"createSurface":{"surfaceId":"test","catalogId":"cat"}}\n\n{"deleteSurface":{"surfaceId":"test"}}\n';
      const parsed = jsonlToMessages(jsonl);

      expect(parsed).toHaveLength(2);
    });
  });
});
