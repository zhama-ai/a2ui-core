/**
 * A2UI Builders Module
 *
 * 提供便捷的函数来构建标准的 A2UI 协议消息和组件
 */

// ============================================================================
// ID Generator
// ============================================================================

export { generateId, resetIdCounter, getIdCounter } from './id-generator';

// ============================================================================
// Component Builder
// ============================================================================

export {
  // 类型
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
  // 内容组件
  text,
  image,
  icon,
  video,
  audioPlayer,
  // 布局组件
  row,
  column,
  list,
  card,
  tabs,
  divider,
  modal,
  // 交互组件
  button,
  checkbox,
  textField,
  dateTimeInput,
  choicePicker,
  slider,
  // 便捷组件
  textButton,
  h1,
  h2,
  h3,
  h4,
  h5,
  caption,
  body,
} from './component-builder';

// ============================================================================
// Message Builder
// ============================================================================

export {
  // v0.9 消息
  createSurface,
  updateComponents,
  updateDataModel,
  deleteSurface,
  createV09Messages,
  // v0.8 消息
  beginRendering,
  surfaceUpdate,
  dataModelUpdate,
  dataModelInit,
  pathUpdate,
  deleteSurfaceV08,
  createV08Messages,
  // 工具
  messagesToJsonl,
  jsonlToMessages,
} from './message-builder';

// ============================================================================
// Data Model Builder
// ============================================================================

export {
  // 类型
  type PathMappings,
  type UpdateDataItem,
  // 常量
  DEFAULT_PATH_MAPPINGS,
  // 转换函数
  objectToValueMap,
  valueToValueMap,
  normalizePath,
  updatesToValueMap,
  flattenObjectToValueMap,
  valueMapToObject,
} from './data-model-builder';
