/**
 * Data Model Builder
 *
 * A2UI v0.9 数据模型工具函数
 * v0.9 直接使用 JSON 值，不需要 ValueMap 包装格式
 */

import type { DataValue } from '../types';

/**
 * 路径映射表类型
 */
export type PathMappings = Record<string, string>;

/**
 * 默认路径映射
 */
export const DEFAULT_PATH_MAPPINGS: PathMappings = {};

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
