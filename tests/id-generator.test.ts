/**
 * ID Generator Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { generateId, resetIdCounter, getIdCounter } from '../src/builders/id-generator';

describe('ID Generator', () => {
  beforeEach(() => {
    resetIdCounter();
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it('should use provided prefix', () => {
      const id = generateId('button');
      expect(id).toMatch(/^button_\d+_\d+$/);
    });

    it('should use default prefix', () => {
      const id = generateId();
      expect(id).toMatch(/^comp_\d+_\d+$/);
    });

    it('should increment counter', () => {
      generateId();
      generateId();
      expect(getIdCounter()).toBe(2);
    });
  });

  describe('resetIdCounter', () => {
    it('should reset counter to 0', () => {
      generateId();
      generateId();
      resetIdCounter();
      expect(getIdCounter()).toBe(0);
    });
  });

  describe('getIdCounter', () => {
    it('should return current counter value', () => {
      expect(getIdCounter()).toBe(0);
      generateId();
      expect(getIdCounter()).toBe(1);
    });
  });
});

