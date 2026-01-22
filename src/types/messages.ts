/**
 * A2UI Message Types
 *
 * 服务器到客户端和客户端到服务器的消息类型，严格按照 A2UI v0.9 官方规范
 * @see https://a2ui.dev/specification/v0_9/server_to_client.json
 * @see https://a2ui.dev/specification/v0_9/client_to_server.json
 */

import type { ComponentInstance } from './components';

// ============================================================================
// Constants
// ============================================================================

/**
 * A2UI 标准 Catalog ID
 */
export const STANDARD_CATALOG_ID = 'https://a2ui.dev/specification/v0_9/standard_catalog.json';

// ============================================================================
// Theme
// ============================================================================

/**
 * 主题配置
 * @see standard_catalog.json#/theme
 */
export interface Theme {
  /**
   * 主要品牌颜色（十六进制代码，如 '#00BFFF'）
   */
  primaryColor?: string;
  /**
   * 代理或工具的图标 URL
   */
  iconUrl?: string;
  /**
   * 代理或工具的显示名称
   */
  agentDisplayName?: string;
}

// ============================================================================
// Server to Client Messages
// ============================================================================

/**
 * CreateSurface 消息
 * @see server_to_client.json#/$defs/CreateSurfaceMessage
 */
export interface CreateSurfaceMessage {
  createSurface: {
    /**
     * Surface 唯一标识符
     */
    surfaceId: string;
    /**
     * 组件目录 ID
     */
    catalogId: string;
    /**
     * Surface 的初始主题参数
     */
    theme?: Theme;
    /**
     * 如果为 true，客户端将在每条消息中发送完整数据模型
     * @default false
     */
    sendDataModel?: boolean;
  };
}

/**
 * UpdateComponents 消息
 * @see server_to_client.json#/$defs/UpdateComponentsMessage
 */
export interface UpdateComponentsMessage {
  updateComponents: {
    /**
     * Surface 唯一标识符
     */
    surfaceId: string;
    /**
     * 组件列表（其中一个必须 id 为 'root'）
     */
    components: ComponentInstance[];
  };
}

/**
 * UpdateDataModel 消息
 * @see server_to_client.json#/$defs/UpdateDataModelMessage
 */
export interface UpdateDataModelMessage {
  updateDataModel: {
    /**
     * Surface 唯一标识符
     */
    surfaceId: string;
    /**
     * 数据路径（可选，省略表示根路径 '/'）
     */
    path?: string;
    /**
     * 数据值（省略则删除路径处的键）
     */
    value?: unknown;
  };
}

/**
 * DeleteSurface 消息
 * @see server_to_client.json#/$defs/DeleteSurfaceMessage
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
 * 服务器到客户端消息
 */
export type ServerToClientMessage =
  | CreateSurfaceMessage
  | UpdateComponentsMessage
  | UpdateDataModelMessage
  | DeleteSurfaceMessage;

// ============================================================================
// Client to Server Messages
// ============================================================================

/**
 * 用户操作事件
 * @see client_to_server.json#/properties/action
 */
export interface ActionMessage {
  /**
   * 操作名称
   */
  name: string;
  /**
   * 触发操作的 Surface ID
   */
  surfaceId: string;
  /**
   * 触发组件的 ID
   */
  sourceComponentId: string;
  /**
   * 时间戳（ISO 8601 格式）
   */
  timestamp: string;
  /**
   * 操作上下文（解析数据绑定后的键值对）
   */
  context: Record<string, unknown>;
}

/**
 * 验证失败错误
 * @see client_to_server.json#/properties/error (VALIDATION_FAILED)
 */
export interface ValidationFailedError {
  code: 'VALIDATION_FAILED';
  surfaceId: string;
  path: string;
  message: string;
}

/**
 * 通用错误
 * @see client_to_server.json#/properties/error (Generic)
 */
export interface GenericError {
  code: string;
  surfaceId: string;
  message: string;
  [key: string]: unknown;
}

/**
 * 客户端错误
 */
export type ClientError = ValidationFailedError | GenericError;

/**
 * 客户端到服务器消息
 * @see client_to_server.json
 */
export type ClientToServerMessage = { action: ActionMessage } | { error: ClientError };

// ============================================================================
// Data Types
// ============================================================================

export type DataValue = string | number | boolean | null | DataObject | DataArray;
export interface DataObject {
  [key: string]: DataValue;
}
export type DataArray = DataValue[];

// ============================================================================
// Client Capabilities (v0.9)
// @see a2ui_client_capabilities.json
// ============================================================================

/**
 * 函数定义
 * @see a2ui_client_capabilities.json#/$defs/FunctionDefinition
 */
export interface FunctionDefinition {
  /**
   * 函数唯一名称
   */
  name: string;
  /**
   * 函数描述
   */
  description?: string;
  /**
   * 参数 JSON Schema
   */
  parameters: Record<string, unknown>;
  /**
   * 返回类型
   */
  returnType: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'any' | 'void';
}

/**
 * 组件和函数目录
 * @see a2ui_client_capabilities.json#/$defs/Catalog
 */
export interface Catalog {
  /**
   * 目录唯一标识符
   */
  catalogId: string;
  /**
   * 组件定义
   */
  components?: Record<string, Record<string, unknown>>;
  /**
   * 函数定义
   */
  functions?: FunctionDefinition[];
  /**
   * 主题定义
   */
  theme?: Record<string, Record<string, unknown>>;
}

/**
 * 客户端能力
 * @see a2ui_client_capabilities.json
 */
export interface ClientCapabilities {
  /**
   * 客户端支持的目录 ID 列表
   */
  supportedCatalogIds: string[];
  /**
   * 内联目录定义（可选）
   */
  inlineCatalogs?: Catalog[];
}

// ============================================================================
// Client Data Model (v0.9)
// @see a2ui_client_data_model.json
// ============================================================================

/**
 * 客户端数据模型（用于 sendDataModel 功能）
 * @see a2ui_client_data_model.json
 */
export interface ClientDataModel {
  /**
   * Surface ID 到数据模型的映射
   */
  surfaces: Record<string, DataObject>;
}

// ============================================================================
// Type Guards
// ============================================================================

export function isCreateSurfaceMessage(
  message: ServerToClientMessage
): message is CreateSurfaceMessage {
  return 'createSurface' in message;
}

export function isUpdateComponentsMessage(
  message: ServerToClientMessage
): message is UpdateComponentsMessage {
  return 'updateComponents' in message;
}

export function isUpdateDataModelMessage(
  message: ServerToClientMessage
): message is UpdateDataModelMessage {
  return 'updateDataModel' in message;
}

export function isDeleteSurfaceMessage(
  message: ServerToClientMessage
): message is DeleteSurfaceMessage {
  return 'deleteSurface' in message;
}

export function isActionMessage(
  message: ClientToServerMessage
): message is { action: ActionMessage } {
  return 'action' in message;
}

export function isErrorMessage(message: ClientToServerMessage): message is { error: ClientError } {
  return 'error' in message;
}
