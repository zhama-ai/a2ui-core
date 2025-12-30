/**
 * Data Model Builder Tests
 */

import { describe, it, expect } from 'vitest';
import {
  objectToValueMap,
  valueToValueMap,
  normalizePath,
  updatesToValueMap,
  flattenObjectToValueMap,
  valueMapToObject,
} from './data-model-builder';

describe('Data Model Builder', () => {
  describe('valueToValueMap', () => {
    it('should convert string value', () => {
      const result = valueToValueMap('/name', 'John');
      expect(result).toEqual({ key: '/name', valueString: 'John' });
    });

    it('should convert number value', () => {
      const result = valueToValueMap('/age', 30);
      expect(result).toEqual({ key: '/age', valueNumber: 30 });
    });

    it('should convert boolean value', () => {
      const result = valueToValueMap('/active', true);
      expect(result).toEqual({ key: '/active', valueBoolean: true });
    });

    it('should convert null to empty string', () => {
      const result = valueToValueMap('/empty', null);
      expect(result).toEqual({ key: '/empty', valueString: '' });
    });

    it('should convert array to valueMap', () => {
      const result = valueToValueMap('/items', ['a', 'b']);
      expect(result).toEqual({
        key: '/items',
        valueMap: [
          { key: '0', valueString: 'a' },
          { key: '1', valueString: 'b' },
        ],
      });
    });

    it('should convert object to valueMap', () => {
      const result = valueToValueMap('/user', { name: 'John', age: 30 });
      expect(result).toEqual({
        key: '/user',
        valueMap: [
          { key: 'name', valueString: 'John' },
          { key: 'age', valueNumber: 30 },
        ],
      });
    });
  });

  describe('objectToValueMap', () => {
    it('should convert simple object', () => {
      const result = objectToValueMap({ name: 'John', age: 30 });
      expect(result).toEqual([
        { key: '/name', valueString: 'John' },
        { key: '/age', valueNumber: 30 },
      ]);
    });

    it('should handle empty object', () => {
      const result = objectToValueMap({});
      expect(result).toEqual([]);
    });

    it('should support prefix', () => {
      const result = objectToValueMap({ name: 'John' }, '/user');
      expect(result).toEqual([{ key: '/user/name', valueString: 'John' }]);
    });
  });

  describe('normalizePath', () => {
    it('should convert dot notation to slash', () => {
      expect(normalizePath('user.name')).toBe('/user/name');
    });

    it('should ensure leading slash', () => {
      expect(normalizePath('user/name')).toBe('/user/name');
    });

    it('should keep existing leading slash', () => {
      expect(normalizePath('/user/name')).toBe('/user/name');
    });

    it('should apply path mappings', () => {
      const result = normalizePath('stats.count', { stats: 'progress' });
      expect(result).toBe('/progress/count');
    });
  });

  describe('updatesToValueMap', () => {
    it('should convert update items', () => {
      const result = updatesToValueMap([
        { path: '/name', value: 'John' },
        { path: '/age', value: 30 },
      ]);
      expect(result).toEqual([
        { key: '/name', valueString: 'John' },
        { key: '/age', valueNumber: 30 },
      ]);
    });

    it('should flatten nested objects', () => {
      const result = updatesToValueMap([
        { path: '/user', value: { name: 'John', age: 30 } },
      ]);
      expect(result).toEqual([
        { key: '/user/name', valueString: 'John' },
        { key: '/user/age', valueNumber: 30 },
      ]);
    });

    it('should respect basePath', () => {
      const result = updatesToValueMap([{ path: 'name', value: 'John' }], '/user');
      expect(result).toEqual([{ key: '/user/name', valueString: 'John' }]);
    });
  });

  describe('flattenObjectToValueMap', () => {
    it('should flatten nested objects', () => {
      const result = flattenObjectToValueMap({ a: { b: 'value' } }, '/root');
      expect(result).toEqual([{ key: '/root/a/b', valueString: 'value' }]);
    });

    it('should handle arrays', () => {
      const result = flattenObjectToValueMap({ items: ['a', 'b'] }, '/data');
      expect(result).toEqual([
        {
          key: '/data/items',
          valueMap: [
            { key: '0', valueString: 'a' },
            { key: '1', valueString: 'b' },
          ],
        },
      ]);
    });
  });

  describe('valueMapToObject', () => {
    it('should convert valueMaps back to object', () => {
      const result = valueMapToObject([
        { key: '/name', valueString: 'John' },
        { key: '/age', valueNumber: 30 },
        { key: '/active', valueBoolean: true },
      ]);
      expect(result).toEqual({
        name: 'John',
        age: 30,
        active: true,
      });
    });

    it('should handle nested valueMap', () => {
      const result = valueMapToObject([
        {
          key: 'user',
          valueMap: [
            { key: 'name', valueString: 'John' },
            { key: 'age', valueNumber: 30 },
          ],
        },
      ]);
      expect(result).toEqual({
        user: { name: 'John', age: 30 },
      });
    });

    it('should strip leading slash from keys', () => {
      const result = valueMapToObject([{ key: '/name', valueString: 'John' }]);
      expect(result).toEqual({ name: 'John' });
    });
  });
});

