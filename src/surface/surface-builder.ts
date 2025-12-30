/**
 * Surface Builder
 *
 * 提供 A2UI Surface 的构建工具函数
 * 基于 v0.9 格式
 *
 * 参考：https://a2ui.org/
 */

import {
  createSurface,
  updateComponents,
  updateDataModel,
  deleteSurface,
} from '../builders/message-builder';
import type { ComponentInstance, DataObject, ServerToClientMessageV09 } from '../types';

import { SURFACE_IDS, generateSurfaceId } from './surface-ids';

/**
 * Surface 构建结果
 */
export interface SurfaceResult {
  /** 构建的消息数组 */
  messages: ServerToClientMessageV09[];
  /** Surface ID */
  surfaceId: string;
}

/**
 * 创建 A2UI Surface 消息
 *
 * @param rootId - 根组件 ID
 * @param components - 组件列表（v0.9 格式）
 * @param surfaceId - Surface ID（可选，自动生成）
 * @returns Surface 构建结果
 *
 * @example
 * ```typescript
 * import { createA2UISurface, h1, column, SURFACE_IDS } from '@zhama/a2ui-core';
 *
 * const title = h1('Hello', { id: 'title' });
 * const root = column(['title'], { id: 'root' });
 *
 * const { messages, surfaceId } = createA2UISurface('root', [title, root], SURFACE_IDS.CHAT);
 * ```
 */
export function createA2UISurface(
  rootId: string,
  components: ComponentInstance[],
  surfaceId?: string
): SurfaceResult {
  const id = surfaceId ?? generateSurfaceId();

  // 确保根组件存在于组件列表中
  const rootComponent = components.find((c) => c.id === rootId);
  if (!rootComponent) {
    console.warn(`[A2UI] Root component "${rootId}" not found in components list`);
  }

  const messages: ServerToClientMessageV09[] = [
    createSurface(id),
    updateComponents(id, components),
  ];

  return { messages, surfaceId: id };
}

/**
 * 创建带数据模型的 A2UI Surface
 *
 * @param rootId - 根组件 ID
 * @param components - 组件列表（v0.9 格式）
 * @param dataModel - 数据模型对象
 * @param surfaceId - Surface ID（可选）
 * @returns Surface 构建结果
 *
 * @example
 * ```typescript
 * const { messages } = createA2UISurfaceWithData(
 *   'root',
 *   [title, greeting, root],
 *   { user: { name: 'John' } },
 *   SURFACE_IDS.CHAT
 * );
 * ```
 */
export function createA2UISurfaceWithData(
  rootId: string,
  components: ComponentInstance[],
  dataModel: DataObject,
  surfaceId?: string
): SurfaceResult {
  const id = surfaceId ?? generateSurfaceId();

  const messages: ServerToClientMessageV09[] = [
    createSurface(id),
    updateComponents(id, components),
    updateDataModel(id, dataModel),
  ];

  return { messages, surfaceId: id };
}

/**
 * 创建删除 Surface 的消息
 *
 * @param surfaceId - 要删除的 Surface ID
 * @returns 删除消息
 */
export function createDeleteSurfaceMessage(surfaceId: string): ServerToClientMessageV09 {
  return deleteSurface(surfaceId);
}

// ============================================================================
// 便捷函数 - 创建特定类型的 Surface
// ============================================================================

/**
 * 创建聊天区 Surface
 */
export function createChatSurface(rootId: string, components: ComponentInstance[]): SurfaceResult {
  return createA2UISurface(rootId, components, SURFACE_IDS.CHAT);
}

/**
 * 创建智能体推荐区 Surface
 */
export function createRecommendationSurface(
  rootId: string,
  components: ComponentInstance[]
): SurfaceResult {
  return createA2UISurface(rootId, components, SURFACE_IDS.RECOMMENDATION);
}

/**
 * 创建输入表单区 Surface
 */
export function createInputFormSurface(
  rootId: string,
  components: ComponentInstance[]
): SurfaceResult {
  return createA2UISurface(rootId, components, SURFACE_IDS.INPUT_FORM);
}

/**
 * 创建编排面板 Surface
 */
export function createOrchestrationSurface(
  rootId: string,
  components: ComponentInstance[]
): SurfaceResult {
  return createA2UISurface(rootId, components, SURFACE_IDS.ORCHESTRATION);
}

/**
 * 创建状态提示 Surface
 */
export function createStatusSurface(
  rootId: string,
  components: ComponentInstance[]
): SurfaceResult {
  return createA2UISurface(rootId, components, SURFACE_IDS.STATUS);
}
