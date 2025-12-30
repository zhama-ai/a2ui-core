/**
 * Message Builder
 *
 * 提供 A2UI v0.9 协议消息的构建工具函数
 *
 * v0.9 消息类型：
 * - createSurface: 创建新的 UI Surface
 * - updateComponents: 更新组件
 * - updateDataModel: 更新数据模型 (JSON Patch 风格)
 * - deleteSurface: 删除 Surface
 *
 * 参考: https://a2ui.org/
 */

import type {
  CreateSurfaceMessage,
  UpdateComponentsMessage,
  UpdateDataModelMessage,
  DeleteSurfaceMessage,
  ServerToClientMessageV09,
  ComponentInstance,
  DataObject,
} from '../types';
import { STANDARD_CATALOG_ID } from '../types';

// ============================================================================
// v0.9 消息构建器
// ============================================================================

/**
 * 创建 CreateSurface 消息
 *
 * @param surfaceId - Surface ID
 * @param catalogId - Catalog ID（默认为标准目录）
 *
 * @example
 * ```typescript
 * const msg = createSurface('my-surface');
 * // { createSurface: { surfaceId: 'my-surface', catalogId: '...' } }
 * ```
 */
export function createSurface(
  surfaceId: string,
  catalogId: string = STANDARD_CATALOG_ID
): CreateSurfaceMessage {
  return {
    createSurface: {
      surfaceId,
      catalogId,
    },
  };
}

/**
 * 创建 UpdateComponents 消息
 *
 * @param surfaceId - Surface ID
 * @param components - 组件列表
 *
 * @example
 * ```typescript
 * const title = text('Hello', { id: 'title' });
 * const msg = updateComponents('my-surface', [title]);
 * ```
 */
export function updateComponents(
  surfaceId: string,
  components: ComponentInstance[]
): UpdateComponentsMessage {
  return {
    updateComponents: {
      surfaceId,
      components,
    },
  };
}

/**
 * 创建 UpdateDataModel 消息
 *
 * @param surfaceId - Surface ID
 * @param value - 数据值
 * @param path - 数据路径（可选，默认为根路径）
 * @param op - 操作类型（默认为 replace）
 *
 * @example
 * ```typescript
 * // 替换整个数据模型
 * updateDataModel('my-surface', { user: { name: 'John' } });
 *
 * // 更新特定路径
 * updateDataModel('my-surface', 'Jane', '/user/name', 'replace');
 *
 * // 添加数据
 * updateDataModel('my-surface', 'new-item', '/items/-', 'add');
 * ```
 */
export function updateDataModel(
  surfaceId: string,
  value: unknown,
  path?: string,
  op: 'add' | 'replace' | 'remove' = 'replace'
): UpdateDataModelMessage {
  return {
    updateDataModel: {
      surfaceId,
      ...(path && { path }),
      op,
      ...(op !== 'remove' && { value }),
    },
  };
}

/**
 * 创建 DeleteSurface 消息
 *
 * @param surfaceId - 要删除的 Surface ID
 */
export function deleteSurface(surfaceId: string): DeleteSurfaceMessage {
  return {
    deleteSurface: {
      surfaceId,
    },
  };
}

/**
 * 创建完整的 v0.9 消息序列
 *
 * @param options - 选项
 * @returns 消息数组（可直接作为 JSONL 流发送）
 *
 * @example
 * ```typescript
 * const title = h1('Welcome', { id: 'title' });
 * const root = column(['title'], { id: 'root' });
 *
 * const messages = createV09Messages({
 *   surfaceId: '@chat',
 *   components: [title, root],
 *   dataModel: { user: { name: 'John' } }
 * });
 *
 * // 发送为 JSONL 流
 * const jsonl = messagesToJsonl(messages);
 * ```
 */
export function createV09Messages(options: {
  surfaceId: string;
  catalogId?: string;
  components: ComponentInstance[];
  dataModel?: DataObject;
}): ServerToClientMessageV09[] {
  const { surfaceId, catalogId = STANDARD_CATALOG_ID, components, dataModel } = options;

  const messages: ServerToClientMessageV09[] = [
    createSurface(surfaceId, catalogId),
    updateComponents(surfaceId, components),
  ];

  if (dataModel) {
    messages.push(updateDataModel(surfaceId, dataModel));
  }

  return messages;
}

// ============================================================================
// 消息工具
// ============================================================================

/**
 * 将消息数组转换为 JSONL 格式字符串
 *
 * @param messages - 消息数组
 * @returns JSONL 格式字符串
 *
 * @example
 * ```typescript
 * const jsonl = messagesToJsonl(messages);
 * // 每行一个 JSON 对象
 * ```
 */
export function messagesToJsonl(messages: ServerToClientMessageV09[]): string {
  return messages.map((msg) => JSON.stringify(msg)).join('\n');
}

/**
 * 从 JSONL 格式字符串解析消息数组
 *
 * @param jsonl - JSONL 格式字符串
 * @returns 消息数组
 */
export function jsonlToMessages(jsonl: string): ServerToClientMessageV09[] {
  return jsonl
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line) as ServerToClientMessageV09);
}
