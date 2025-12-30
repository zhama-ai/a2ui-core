/**
 * Message Builder
 *
 * 提供 A2UI 协议消息的构建工具函数
 * 支持 v0.8 和 v0.9 两种消息格式
 */

import type {
  // v0.9
  CreateSurfaceMessage,
  UpdateComponentsMessage,
  UpdateDataModelMessage,
  DeleteSurfaceMessage,
  ServerToClientMessageV09,
  // v0.8
  BeginRenderingMessage,
  SurfaceUpdateMessage,
  DataModelUpdateMessage,
  ServerToClientMessageV08,
  ComponentInstanceV08,
  ValueMap,
  // Common
  ComponentInstance,
  DataObject,
  DataValue,
} from '../types';
import { STANDARD_CATALOG_ID } from '../types';

import { objectToValueMap, valueToValueMap } from './data-model-builder';

// ============================================================================
// v0.9 消息构建器
// ============================================================================

/**
 * 创建 CreateSurface 消息 (v0.9)
 *
 * @param surfaceId - Surface ID
 * @param catalogId - Catalog ID（默认为标准目录）
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
 * 创建 UpdateComponents 消息 (v0.9)
 *
 * @param surfaceId - Surface ID
 * @param components - 组件列表
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
 * 创建 UpdateDataModel 消息 (v0.9)
 *
 * @param surfaceId - Surface ID
 * @param value - 数据值
 * @param path - 数据路径（可选）
 * @param op - 操作类型（默认为 replace）
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
 * 创建 DeleteSurface 消息 (v0.9)
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
// v0.8 消息构建器
// ============================================================================

/**
 * 创建 BeginRendering 消息 (v0.8)
 *
 * @param rootId - 根组件 ID
 * @param surfaceId - Surface ID
 * @param styles - 样式配置
 */
export function beginRendering(
  rootId: string,
  surfaceId = '@default',
  styles?: Record<string, string>
): BeginRenderingMessage {
  return {
    beginRendering: {
      surfaceId,
      root: rootId,
      ...(styles && { styles }),
    },
  };
}

/**
 * 创建 SurfaceUpdate 消息 (v0.8)
 *
 * @param components - 组件定义数组
 * @param surfaceId - Surface ID
 */
export function surfaceUpdate(
  components: ComponentInstanceV08[],
  surfaceId = '@default'
): SurfaceUpdateMessage {
  return {
    surfaceUpdate: {
      surfaceId,
      components,
    },
  };
}

/**
 * 创建 DataModelUpdate 消息 (v0.8)
 *
 * @param contents - ValueMap 数组
 * @param surfaceId - Surface ID
 * @param path - 数据路径（可选）
 */
export function dataModelUpdate(
  contents: ValueMap[],
  surfaceId = '@default',
  path?: string
): DataModelUpdateMessage {
  return {
    dataModelUpdate: {
      surfaceId,
      contents,
      ...(path && { path }),
    },
  };
}

/**
 * 创建 DataModel 初始化消息 (v0.8)
 *
 * @param data - 初始数据对象
 * @param surfaceId - Surface ID
 */
export function dataModelInit(data: DataObject, surfaceId = '@default'): DataModelUpdateMessage {
  return dataModelUpdate(objectToValueMap(data), surfaceId);
}

/**
 * 创建路径更新消息 (v0.8)
 *
 * @param path - 数据路径
 * @param value - 新值
 * @param surfaceId - Surface ID
 */
export function pathUpdate(
  path: string,
  value: DataValue,
  surfaceId = '@default'
): DataModelUpdateMessage {
  return {
    dataModelUpdate: {
      surfaceId,
      path,
      contents: [valueToValueMap('', value)],
    },
  };
}

/**
 * 创建 DeleteSurface 消息 (v0.8)
 *
 * @param surfaceId - 要删除的 Surface ID
 */
export function deleteSurfaceV08(surfaceId: string): {
  deleteSurface: { surfaceId: string };
} {
  return {
    deleteSurface: {
      surfaceId,
    },
  };
}

/**
 * 创建完整的 v0.8 消息数组
 *
 * @param options - 选项
 * @returns 消息数组
 */
export function createV08Messages(options: {
  rootId: string;
  components: ComponentInstanceV08[];
  dataModel?: DataObject;
  surfaceId?: string;
  styles?: Record<string, string>;
}): ServerToClientMessageV08[] {
  const { rootId, components, dataModel, surfaceId = '@default', styles } = options;

  const messages: ServerToClientMessageV08[] = [surfaceUpdate(components, surfaceId)];

  if (dataModel) {
    messages.push(dataModelInit(dataModel, surfaceId));
  }

  messages.push(beginRendering(rootId, surfaceId, styles));

  return messages;
}

// ============================================================================
// 通用消息工具
// ============================================================================

/**
 * 将消息数组转换为 JSONL 格式字符串
 *
 * @param messages - 消息数组
 * @returns JSONL 格式字符串
 */
export function messagesToJsonl(
  messages: Array<ServerToClientMessageV08 | ServerToClientMessageV09>
): string {
  return messages.map((msg) => JSON.stringify(msg)).join('\n');
}

/**
 * 从 JSONL 格式字符串解析消息数组
 *
 * @param jsonl - JSONL 格式字符串
 * @returns 消息数组
 */
export function jsonlToMessages(
  jsonl: string
): Array<ServerToClientMessageV08 | ServerToClientMessageV09> {
  return jsonl
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line) as ServerToClientMessageV08 | ServerToClientMessageV09);
}
