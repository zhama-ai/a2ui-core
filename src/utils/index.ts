/**
 * A2UI Utilities
 */

import type { DynamicString, DynamicNumber, DynamicBoolean, DataBinding } from '../types';

/**
 * 判断值是否为数据绑定
 */
export function isDataBinding(
  value: DynamicString | DynamicNumber | DynamicBoolean
): value is DataBinding {
  return typeof value === 'object' && value !== null && 'path' in value;
}

/**
 * 从值中获取字面量（如果是绑定则返回 undefined）
 */
export function getLiteralValue<T extends string | number | boolean>(
  value: T | DataBinding
): T | undefined {
  if (isDataBinding(value)) {
    return undefined;
  }
  return value as T;
}

/**
 * 从值中获取路径（如果是字面量则返回 undefined）
 */
export function getPathValue(
  value: DynamicString | DynamicNumber | DynamicBoolean
): string | undefined {
  if (isDataBinding(value)) {
    return value.path;
  }
  return undefined;
}

/**
 * 创建数据绑定
 */
export function path(dataPath: string): DataBinding {
  return { path: dataPath };
}

/**
 * 深度合并对象
 */
export function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const result = { ...target };

  for (const key of Object.keys(source) as Array<keyof T>) {
    const sourceValue = source[key];
    const targetValue = result[key];

    if (
      sourceValue !== undefined &&
      typeof sourceValue === 'object' &&
      sourceValue !== null &&
      !Array.isArray(sourceValue) &&
      typeof targetValue === 'object' &&
      targetValue !== null &&
      !Array.isArray(targetValue)
    ) {
      result[key] = deepMerge(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>
      ) as T[keyof T];
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue as T[keyof T];
    }
  }

  return result;
}

/**
 * 生成 UUID v4
 */
export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
