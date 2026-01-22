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
import type { ComponentInstance, DataObject, ServerToClientMessage, Theme } from '../types';

import { SURFACE_IDS, generateSurfaceId } from './surface-ids';

/**
 * Surface 构建结果
 */
export interface SurfaceResult {
  /** 构建的消息数组 */
  messages: ServerToClientMessage[];
  /** Surface ID */
  surfaceId: string;
}

/**
 * Surface 选项
 */
export interface SurfaceOptions {
  /** Surface ID（可选，自动生成） */
  surfaceId?: string;
  /** 主题配置 */
  theme?: Theme;
  /** 是否发送数据模型 */
  sendDataModel?: boolean;
}

/**
 * 创建 A2UI Surface 消息
 *
 * @param rootId - 根组件 ID
 * @param components - 组件列表（v0.9 格式）
 * @param options - 可选配置
 * @returns Surface 构建结果
 *
 * @example
 * ```typescript
 * import { createA2UISurface, h1, column, SURFACE_IDS } from '@zhama/a2ui-core';
 *
 * const title = h1('Hello', { id: 'title' });
 * const root = column(['title'], { id: 'root' });
 *
 * const { messages, surfaceId } = createA2UISurface('root', [title, root], {
 *   surfaceId: SURFACE_IDS.CHAT
 * });
 * ```
 */
export function createA2UISurface(
  rootId: string,
  components: ComponentInstance[],
  options: SurfaceOptions = {}
): SurfaceResult {
  const { surfaceId, theme, sendDataModel } = options;
  const id = surfaceId ?? generateSurfaceId();

  // 确保根组件存在于组件列表中
  const rootComponent = components.find((c) => c.id === rootId);
  if (!rootComponent) {
    console.warn(`[A2UI] Root component "${rootId}" not found in components list`);
  }

  const messages: ServerToClientMessage[] = [
    createSurface(id, { theme, sendDataModel }),
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
 * @param options - 可选配置
 * @returns Surface 构建结果
 *
 * @example
 * ```typescript
 * const { messages } = createA2UISurfaceWithData(
 *   'root',
 *   [title, greeting, root],
 *   { user: { name: 'John' } },
 *   { surfaceId: SURFACE_IDS.CHAT }
 * );
 * ```
 */
export function createA2UISurfaceWithData(
  rootId: string,
  components: ComponentInstance[],
  dataModel: DataObject,
  options: SurfaceOptions = {}
): SurfaceResult {
  const { surfaceId, theme, sendDataModel } = options;
  const id = surfaceId ?? generateSurfaceId();

  const messages: ServerToClientMessage[] = [
    createSurface(id, { theme, sendDataModel }),
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
export function createDeleteSurfaceMessage(surfaceId: string): ServerToClientMessage {
  return deleteSurface(surfaceId);
}

// ============================================================================
// 便捷函数 - 创建特定类型的 Surface
// ============================================================================

/**
 * 创建聊天区 Surface
 */
export function createChatSurface(
  rootId: string,
  components: ComponentInstance[],
  options: Omit<SurfaceOptions, 'surfaceId'> = {}
): SurfaceResult {
  return createA2UISurface(rootId, components, { ...options, surfaceId: SURFACE_IDS.CHAT });
}

/**
 * 创建智能体推荐区 Surface
 */
export function createRecommendationSurface(
  rootId: string,
  components: ComponentInstance[],
  options: Omit<SurfaceOptions, 'surfaceId'> = {}
): SurfaceResult {
  return createA2UISurface(rootId, components, {
    ...options,
    surfaceId: SURFACE_IDS.RECOMMENDATION,
  });
}

/**
 * 创建输入表单区 Surface
 */
export function createInputFormSurface(
  rootId: string,
  components: ComponentInstance[],
  options: Omit<SurfaceOptions, 'surfaceId'> = {}
): SurfaceResult {
  return createA2UISurface(rootId, components, { ...options, surfaceId: SURFACE_IDS.INPUT_FORM });
}

/**
 * 创建编排面板 Surface
 */
export function createOrchestrationSurface(
  rootId: string,
  components: ComponentInstance[],
  options: Omit<SurfaceOptions, 'surfaceId'> = {}
): SurfaceResult {
  return createA2UISurface(rootId, components, {
    ...options,
    surfaceId: SURFACE_IDS.ORCHESTRATION,
  });
}

/**
 * 创建状态提示 Surface
 */
export function createStatusSurface(
  rootId: string,
  components: ComponentInstance[],
  options: Omit<SurfaceOptions, 'surfaceId'> = {}
): SurfaceResult {
  return createA2UISurface(rootId, components, { ...options, surfaceId: SURFACE_IDS.STATUS });
}
