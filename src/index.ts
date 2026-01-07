/**
 * @zhama/a2ui-core
 *
 * A2UI Protocol Core Library - v0.9
 * Framework-agnostic TypeScript types and builders for A2UI protocol
 *
 * @example
 * ```typescript
 * import {
 *   // Types
 *   type ComponentInstance,
 *   type ServerToClientMessage,
 *
 *   // Builders
 *   text, column, button, card,
 *   createSurface, updateComponents, updateDataModel,
 *   createV09Messages,
 *
 *   // Validators
 *   validateMessage,
 *
 *   // Utils
 *   path, generateId,
 * } from '@zhama/a2ui-core';
 *
 * // 创建组件
 * const title = text('Hello World', { id: 'title', usageHint: 'h1' });
 * const greeting = text({ path: '/user/name' }, { id: 'greeting' });
 * const root = column(['title', 'greeting'], { id: 'root' });
 *
 * // 创建消息
 * const messages = createV09Messages({
 *   surfaceId: 'my-surface',
 *   components: [title, greeting, root],
 *   dataModel: { user: { name: 'John' } },
 * });
 *
 * // 验证消息
 * const result = validateMessage(messages[0]);
 * console.log(result.valid); // true
 * ```
 */

// ============================================================================
// Types - 类型定义 (v0.9 only)
// ============================================================================

export type {
  // Primitives
  StringOrPath,
  NumberOrPath,
  BooleanOrPath,
  StringArrayOrPath,
  ContextValue,
  // Components
  Action,
  ComponentCommon,
  TextComponent,
  ImageComponent,
  IconComponent,
  VideoComponent,
  AudioPlayerComponent,
  StandardIconName,
  ChildrenProperty,
  RowComponent,
  ColumnComponent,
  ListComponent,
  CardComponent,
  TabsComponent,
  DividerComponent,
  ModalComponent,
  ButtonComponent,
  CheckBoxComponent,
  TextFieldComponent,
  DateTimeInputComponent,
  ChoicePickerComponent,
  SliderComponent,
  AnyComponent,
  ComponentType,
  ComponentInstance,
  // Theme
  Theme,
  // Messages v0.9
  CreateSurfaceMessage,
  UpdateComponentsMessage,
  UpdateDataModelMessage,
  DeleteSurfaceMessage,
  ServerToClientMessageV09,
  // Client Messages
  UserActionEvent,
  DataChangeEvent,
  ClientErrorMessage,
  ValidationFailedError,
  GenericError,
  ClientToServerMessage,
  // Data Types
  DataValue,
  DataObject,
  DataArray,
} from './types';

// ServerToClientMessage 别名（纯 v0.9）
export type { ServerToClientMessageV09 as ServerToClientMessage } from './types';

export { isV09Message, STANDARD_CATALOG_ID, A2UI_EXTENSION_URI, A2UI_MIME_TYPE } from './types';

// ============================================================================
// Builders - 构建器
// ============================================================================

export {
  // ID Generator
  generateId,
  resetIdCounter,
  getIdCounter,
  // ========== Component Builder (v0.9) ==========
  // Component Builder Types
  type ComponentOptions,
  type TextOptions,
  type ImageOptions,
  type IconOptions,
  type VideoOptions,
  type AudioPlayerOptions,
  type LayoutOptions,
  type ListOptions,
  type CardOptions,
  type TabsOptions,
  type TabItem,
  type DividerOptions,
  type ModalOptions,
  type ButtonOptions,
  type CheckBoxOptions,
  type TextFieldOptions,
  type DateTimeInputOptions,
  type ChoicePickerOptions,
  type SliderOptions,
  // Content Components
  text,
  image,
  icon,
  video,
  audioPlayer,
  // Layout Components
  row,
  column,
  list,
  card,
  tabs,
  divider,
  modal,
  // Interactive Components
  button,
  checkbox,
  textField,
  dateTimeInput,
  choicePicker,
  slider,
  // Convenience Components
  textButton,
  h1,
  h2,
  h3,
  h4,
  h5,
  caption,
  body,
  // ========== Message Builders (v0.9) ==========
  createSurface,
  updateComponents,
  updateDataModel,
  deleteSurface,
  createV09Messages,
  // Message Tools
  messagesToJsonl,
  jsonlToMessages,
  // ========== Data Model Builder ==========
  // Data Model Builder Types
  type PathMappings,
  type UpdateDataItem,
  // Data Model Builder
  DEFAULT_PATH_MAPPINGS,
  objectToValueMap,
  valueToValueMap,
  normalizePath,
  updatesToValueMap,
  flattenObjectToValueMap,
  valueMapToObject,
} from './builders';

// ============================================================================
// Validators - 验证器
// ============================================================================

export {
  // 基础验证
  type ValidationResult,
  type ValidationError,
  type ValidationWarning,
  type ValidationOptions,
  validateV09Message,
  validateMessage,
  validateMessages,
} from './validators';

// ============================================================================
// Utils - 工具函数
// ============================================================================

export { isPathBinding, getLiteralValue, getPathValue, path, deepMerge, uuid } from './utils';

// ============================================================================
// Surface - Surface 构建工具 (v0.9 格式)
// ============================================================================

export {
  // Surface IDs
  SURFACE_IDS,
  type SurfaceIdType,
  type SurfaceConfig,
  generateSurfaceId,
  resetSurfaceIdCounter,
  // Surface Builder
  type SurfaceResult,
  createA2UISurface,
  createA2UISurfaceWithData,
  createDeleteSurfaceMessage,
  // Surface 便捷函数
  createChatSurface,
  createRecommendationSurface,
  createInputFormSurface,
  createOrchestrationSurface,
  createStatusSurface,
} from './surface';
