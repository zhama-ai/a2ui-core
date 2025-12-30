/**
 * Data Model Builder
 *
 * 提供 DataModel 相关的构建工具函数
 * 包括 v0.9 JSON 对象格式和 v0.8 ValueMap 格式转换
 */

import type { DataValue, DataObject } from '../types';

/**
 * ValueMap 格式 - 用于 v0.8 兼容和内部数据转换
 * @internal
 */
export interface ValueMap {
  key: string;
  valueString?: string;
  valueNumber?: number;
  valueBoolean?: boolean;
  valueMap?: ValueMap[];
}

/**
 * 路径映射表类型
 */
export type PathMappings = Record<string, string>;

/**
 * 默认路径映射
 */
export const DEFAULT_PATH_MAPPINGS: PathMappings = {};

/**
 * 将 JavaScript 对象转换为 A2UI ValueMap 格式
 *
 * @param obj - JavaScript 对象
 * @param prefix - 路径前缀（用于嵌套对象的 key 生成）
 *
 * @example
 * objectToValueMap({ name: 'John', age: 30 });
 * // Returns: [
 * //   { key: '/name', valueString: 'John' },
 * //   { key: '/age', valueNumber: 30 }
 * // ]
 */
export function objectToValueMap(obj: DataObject, prefix = ''): ValueMap[] {
  const entries: ValueMap[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}/${key}` : `/${key}`;
    entries.push(valueToValueMap(fullKey, value));
  }

  return entries;
}

/**
 * 将单个值转换为 A2UI ValueMap 格式
 *
 * @param key - 数据路径/键
 * @param value - JavaScript 值
 */
export function valueToValueMap(key: string, value: DataValue): ValueMap {
  if (value === null || value === undefined) {
    return { key, valueString: '' };
  }

  if (typeof value === 'string') {
    return { key, valueString: value };
  }

  if (typeof value === 'number') {
    return { key, valueNumber: value };
  }

  if (typeof value === 'boolean') {
    return { key, valueBoolean: value };
  }

  if (Array.isArray(value)) {
    return {
      key,
      valueMap: value.map((item, index) => valueToValueMap(String(index), item)),
    };
  }

  if (typeof value === 'object') {
    const nestedMaps: ValueMap[] = [];
    for (const [k, v] of Object.entries(value)) {
      nestedMaps.push(valueToValueMap(k, v as DataValue));
    }
    return { key, valueMap: nestedMaps };
  }

  return { key, valueString: String(value) };
}

/**
 * 规范化路径格式
 * - 将 . 分隔符转换为 /
 * - 确保路径以 / 开头
 * - 可选路径映射
 *
 * @param path - 原始路径
 * @param pathMappings - 可选路径映射表
 *
 * @example
 * normalizePath('user.name');        // '/user/name'
 * normalizePath('/user/name');       // '/user/name'
 * normalizePath('stats.count', { stats: 'progress' });  // '/progress/count'
 */
export function normalizePath(path: string, pathMappings: PathMappings = {}): string {
  // 1. 将 . 分隔符转换为 /
  let normalizedPath = path.replace(/\./g, '/');

  // 2. 确保路径以 / 开头
  if (!normalizedPath.startsWith('/')) {
    normalizedPath = `/${normalizedPath}`;
  }

  // 3. 应用路径映射
  for (const [from, to] of Object.entries(pathMappings)) {
    const fromPattern = new RegExp(`^/${from}(/|$)`);
    if (fromPattern.test(normalizedPath)) {
      normalizedPath = normalizedPath.replace(fromPattern, `/${to}$1`);
    }
  }

  return normalizedPath;
}

/**
 * 更新数据项定义
 */
export interface UpdateDataItem {
  /** 数据路径 */
  path: string;
  /** 新值 */
  value: DataValue;
  /** 值类型（可选，用于类型提示） */
  valueType?: 'string' | 'number' | 'boolean' | 'list' | 'map';
  /** 操作类型（可选，用于增量更新） */
  operation?: 'set' | 'increment' | 'decrement' | 'append' | 'remove';
}

/**
 * 将更新数据项数组转换为 ValueMap
 *
 * @param updates - 更新数据项
 * @param basePath - 基础路径
 * @param pathMappings - 可选路径映射表
 */
export function updatesToValueMap(
  updates: UpdateDataItem[],
  basePath = '',
  pathMappings: PathMappings = DEFAULT_PATH_MAPPINGS
): ValueMap[] {
  const entries: ValueMap[] = [];

  for (const update of updates) {
    const rawPath = update.path.startsWith('/') ? update.path : `${basePath}/${update.path}`;
    const normalizedPath = normalizePath(rawPath, pathMappings);

    if (update.value !== null && typeof update.value === 'object' && !Array.isArray(update.value)) {
      const flattenedEntries = flattenObjectToValueMap(update.value as DataObject, normalizedPath);
      entries.push(...flattenedEntries);
    } else {
      entries.push(valueToValueMap(normalizedPath, update.value));
    }
  }

  return entries;
}

/**
 * 将嵌套对象扁平化为 ValueMap 条目
 *
 * @param obj - 要扁平化的对象
 * @param basePath - 基础路径
 */
export function flattenObjectToValueMap(obj: DataObject, basePath: string): ValueMap[] {
  const entries: ValueMap[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const fullPath = `${basePath}/${key}`;

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      const nestedEntries = flattenObjectToValueMap(value as DataObject, fullPath);
      entries.push(...nestedEntries);
    } else {
      entries.push(valueToValueMap(fullPath, value as DataValue));
    }
  }

  return entries;
}

/**
 * 从 ValueMap 数组中提取普通 JavaScript 对象
 *
 * @param valueMaps - ValueMap 数组
 * @returns JavaScript 对象
 */
export function valueMapToObject(valueMaps: ValueMap[]): DataObject {
  const result: DataObject = {};

  for (const valueMap of valueMaps) {
    const key = valueMap.key.startsWith('/') ? valueMap.key.slice(1) : valueMap.key;

    if (valueMap.valueString !== undefined) {
      result[key] = valueMap.valueString;
    } else if (valueMap.valueNumber !== undefined) {
      result[key] = valueMap.valueNumber;
    } else if (valueMap.valueBoolean !== undefined) {
      result[key] = valueMap.valueBoolean;
    } else if (valueMap.valueMap !== undefined) {
      result[key] = valueMapToObject(valueMap.valueMap);
    }
  }

  return result;
}
