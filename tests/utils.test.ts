/**
 * Utils Tests
 */

import { describe, it, expect } from 'vitest';
import {
  isPathBinding,
  getLiteralValue,
  getPathValue,
  path,
  deepMerge,
  uuid,
} from '../src/utils/index';

describe('Utils', () => {
  describe('isPathBinding', () => {
    it('should return true for path objects', () => {
      expect(isPathBinding({ path: '/user/name' })).toBe(true);
    });

    it('should return false for string literals', () => {
      expect(isPathBinding('hello')).toBe(false);
    });

    it('should return false for number literals', () => {
      expect(isPathBinding(42)).toBe(false);
    });

    it('should return false for boolean literals', () => {
      expect(isPathBinding(true)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isPathBinding(null as unknown as string)).toBe(false);
    });
  });

  describe('getLiteralValue', () => {
    it('should return literal string', () => {
      expect(getLiteralValue('hello')).toBe('hello');
    });

    it('should return literal number', () => {
      expect(getLiteralValue(42)).toBe(42);
    });

    it('should return literal boolean', () => {
      expect(getLiteralValue(true)).toBe(true);
    });

    it('should return undefined for path binding', () => {
      expect(getLiteralValue({ path: '/user/name' })).toBeUndefined();
    });
  });

  describe('getPathValue', () => {
    it('should return path string for path binding', () => {
      expect(getPathValue({ path: '/user/name' })).toBe('/user/name');
    });

    it('should return undefined for literal string', () => {
      expect(getPathValue('hello')).toBeUndefined();
    });

    it('should return undefined for literal number', () => {
      expect(getPathValue(42)).toBeUndefined();
    });
  });

  describe('path', () => {
    it('should create path binding object', () => {
      expect(path('/user/name')).toEqual({ path: '/user/name' });
    });
  });

  describe('deepMerge', () => {
    it('should merge simple objects', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };
      expect(deepMerge(target, source)).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should merge nested objects', () => {
      const target = { user: { name: 'John', age: 30 } };
      const source = { user: { age: 31 } };
      expect(deepMerge(target, source)).toEqual({
        user: { name: 'John', age: 31 },
      });
    });

    it('should not mutate original target', () => {
      const target = { a: 1 };
      const source = { b: 2 };
      const result = deepMerge(target, source);
      expect(target).toEqual({ a: 1 });
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should handle undefined values', () => {
      const target = { a: 1, b: 2 };
      const source = { a: undefined, c: 3 };
      expect(deepMerge(target, source)).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should not deep merge arrays', () => {
      const target = { arr: [1, 2] };
      const source = { arr: [3, 4] };
      expect(deepMerge(target, source)).toEqual({ arr: [3, 4] });
    });
  });

  describe('uuid', () => {
    it('should generate valid UUID v4 format', () => {
      const id = uuid();
      const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(id).toMatch(uuidV4Regex);
    });

    it('should generate unique IDs', () => {
      const ids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        ids.add(uuid());
      }
      expect(ids.size).toBe(100);
    });
  });
});

