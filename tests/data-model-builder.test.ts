/**
 * Data Model Builder Tests - v0.9
 *
 * 测试数据模型工具函数
 */

import { describe, it, expect } from 'vitest';
import { normalizePath } from '../src/builders/data-model-builder';

describe('Data Model Builder', () => {
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

    it('should handle empty path', () => {
      expect(normalizePath('')).toBe('/');
    });

    it('should handle root path', () => {
      expect(normalizePath('/')).toBe('/');
    });

    it('should handle multiple segments', () => {
      expect(normalizePath('a.b.c.d')).toBe('/a/b/c/d');
    });

    it('should handle mixed notation', () => {
      expect(normalizePath('a.b/c.d')).toBe('/a/b/c/d');
    });

    it('should apply multiple path mappings', () => {
      const result = normalizePath('form.fields.name', {
        form: 'data',
        fields: 'inputs',
      });
      expect(result).toBe('/data/fields/name');
    });
  });
});
