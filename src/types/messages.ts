/**
 * A2UI Message Types
 *
 * 服务器到客户端的消息类型定义
 * Based on A2UI v0.9 specification
 */

import type { ComponentInstance } from './components';

// ============================================================================
// Theme
// ============================================================================

/**
 * A2UI 主题配置
 */
export interface Theme {
  /**
   * 主要字体
   */
  font?: string;
  /**
   * 主题色（十六进制格式，如 '#00BFFF'）
   */
  primaryColor?: string;
  /**
   * 其他自定义样式
   */
  [key: string]: string | undefined;
}

// ============================================================================
// v0.9 消息格式
// ============================================================================

/**
 * CreateSurface 消息 - 创建新的 UI Surface
 */
export interface CreateSurfaceMessage {
  createSurface: {
    /**
     * Surface 唯一标识符
     */
    surfaceId: string;
    /**
     * 组件目录 ID
     * @example "https://a2ui.dev/specification/0.9/standard_catalog_definition.json"
     */
    catalogId: string;
  };
}

/**
 * UpdateComponents 消息 - 更新 Surface 中的组件
 */
export interface UpdateComponentsMessage {
  updateComponents: {
    /**
     * Surface 唯一标识符
     */
    surfaceId: string;
    /**
     * 组件列表（扁平化，通过 ID 引用建立关系）
     */
    components: ComponentInstance[];
  };
}

/**
 * UpdateDataModel 消息 - 更新数据模型
 */
export interface UpdateDataModelMessage {
  updateDataModel: {
    /**
     * Surface 唯一标识符
     */
    surfaceId: string;
    /**
     * 数据路径（可选，默认为根路径）
     * @example "/user/name"
     */
    path?: string;
    /**
     * 操作类型
     */
    op?: 'add' | 'replace' | 'remove';
    /**
     * 数据值（add/replace 操作需要）
     */
    value?: unknown;
  };
}

/**
 * DeleteSurface 消息 - 删除 Surface
 */
export interface DeleteSurfaceMessage {
  deleteSurface: {
    /**
     * 要删除的 Surface ID
     */
    surfaceId: string;
  };
}

/**
 * v0.9 服务器到客户端消息
 */
export type ServerToClientMessageV09 =
  | CreateSurfaceMessage
  | UpdateComponentsMessage
  | UpdateDataModelMessage
  | DeleteSurfaceMessage;

// ============================================================================
// v0.8 消息格式（兼容性）
// ============================================================================

/**
 * BeginRendering 消息 (v0.8) - 开始渲染
 */
export interface BeginRenderingMessage {
  beginRendering: {
    /**
     * Surface ID
     */
    surfaceId: string;
    /**
     * 根组件 ID
     */
    root: string;
    /**
     * 样式配置
     */
    styles?: Theme;
  };
}

/**
 * SurfaceUpdate 消息 (v0.8) - 更新组件
 */
export interface SurfaceUpdateMessage {
  surfaceUpdate: {
    surfaceId: string;
    components: ComponentInstanceV08[];
  };
}

/**
 * v0.8 组件实例格式
 */
export interface ComponentInstanceV08 {
  id: string;
  weight?: number;
  component: Record<string, unknown>;
}

/**
 * DataModelUpdate 消息 (v0.8) - 更新数据模型
 */
export interface DataModelUpdateMessage {
  dataModelUpdate: {
    surfaceId: string;
    path?: string;
    contents: ValueMap[];
  };
}

/**
 * DeleteSurface 消息 (v0.8)
 */
export interface DeleteSurfaceMessageV08 {
  deleteSurface: {
    surfaceId: string;
  };
}

/**
 * v0.8 ValueMap 格式
 */
export interface ValueMap {
  key: string;
  valueString?: string;
  valueNumber?: number;
  valueBoolean?: boolean;
  valueMap?: ValueMap[];
}

/**
 * v0.8 服务器到客户端消息
 */
export type ServerToClientMessageV08 =
  | BeginRenderingMessage
  | SurfaceUpdateMessage
  | DataModelUpdateMessage
  | DeleteSurfaceMessageV08;

// ============================================================================
// 通用消息类型
// ============================================================================

/**
 * 服务器到客户端消息（支持 v0.8 和 v0.9）
 */
export type ServerToClientMessage = ServerToClientMessageV08 | ServerToClientMessageV09;

/**
 * 判断是否为 v0.9 消息
 */
export function isV09Message(message: ServerToClientMessage): message is ServerToClientMessageV09 {
  return (
    'createSurface' in message || 'updateComponents' in message || 'updateDataModel' in message
  );
}

/**
 * 判断是否为 v0.8 消息
 */
export function isV08Message(message: ServerToClientMessage): message is ServerToClientMessageV08 {
  return 'beginRendering' in message || 'surfaceUpdate' in message || 'dataModelUpdate' in message;
}

// ============================================================================
// 客户端到服务器消息
// ============================================================================

/**
 * 用户操作事件
 */
export interface UserActionEvent {
  /**
   * 操作名称
   */
  actionName: string;
  /**
   * 触发组件的 ID
   */
  sourceComponentId: string;
  /**
   * 时间戳（ISO 8601 格式）
   */
  timestamp: string;
  /**
   * 操作上下文（解析后的值）
   */
  context?: Record<string, unknown>;
}

/**
 * 数据变更事件
 */
export interface DataChangeEvent {
  /**
   * Surface ID
   */
  surfaceId: string;
  /**
   * 数据路径
   */
  path: string;
  /**
   * 新值
   */
  value: unknown;
  /**
   * 触发组件的 ID
   */
  sourceComponentId: string;
}

/**
 * 客户端到服务器消息
 */
export type ClientToServerMessage =
  | { userAction: UserActionEvent }
  | { dataChange: DataChangeEvent };

// ============================================================================
// 数据类型
// ============================================================================

/**
 * 数据模型值类型
 */
export type DataValue = string | number | boolean | null | DataObject | DataArray;

/**
 * 数据对象
 */
export interface DataObject {
  [key: string]: DataValue;
}

/**
 * 数据数组
 */
export type DataArray = DataValue[];

/**
 * A2UI 标准 Catalog ID
 */
export const STANDARD_CATALOG_ID =
  'https://a2ui.dev/specification/0.9/standard_catalog_definition.json';

/**
 * A2UI 扩展 URI (v0.8)
 */
export const A2UI_EXTENSION_URI_V08 = 'https://a2ui.org/a2a-extension/a2ui/v0.8';

/**
 * A2UI 扩展 URI (v0.9)
 */
export const A2UI_EXTENSION_URI = 'https://a2ui.dev/specification/0.9';

/**
 * A2UI MIME 类型
 */
export const A2UI_MIME_TYPE = 'application/json+a2ui';
