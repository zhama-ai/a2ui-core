/**
 * A2UI Types Module
 *
 * 导出所有 A2UI 协议相关的类型定义
 */

// Primitives
export type {
  StringOrPath,
  NumberOrPath,
  BooleanOrPath,
  StringArrayOrPath,
  StringValue,
  NumberValue,
  BooleanValue,
  StringArrayValue,
  ContextValue,
} from './primitives';

// Components
export type {
  // Action
  Action,
  ActionContextItem,
  ActionV08,
  // Common
  ComponentCommon,
  // Content components
  TextComponent,
  ImageComponent,
  IconComponent,
  VideoComponent,
  AudioPlayerComponent,
  StandardIconName,
  // Layout components
  ChildrenProperty,
  RowComponent,
  ColumnComponent,
  ListComponent,
  CardComponent,
  TabsComponent,
  DividerComponent,
  ModalComponent,
  // Interactive components
  ButtonComponent,
  CheckBoxComponent,
  TextFieldComponent,
  DateTimeInputComponent,
  ChoicePickerComponent,
  SliderComponent,
  // Union types
  AnyComponent,
  ComponentType,
  ComponentInstance,
} from './components';

// Messages
export type {
  // Theme
  Theme,
  // v0.9 messages
  CreateSurfaceMessage,
  UpdateComponentsMessage,
  UpdateDataModelMessage,
  DeleteSurfaceMessage,
  ServerToClientMessageV09,
  // v0.8 messages
  BeginRenderingMessage,
  SurfaceUpdateMessage,
  ComponentInstanceV08,
  DataModelUpdateMessage,
  DeleteSurfaceMessageV08,
  ValueMap,
  ServerToClientMessageV08,
  // Generic
  ServerToClientMessage,
  // Client messages
  UserActionEvent,
  DataChangeEvent,
  ClientToServerMessage,
  // Data types
  DataValue,
  DataObject,
  DataArray,
} from './messages';

export {
  isV08Message,
  isV09Message,
  STANDARD_CATALOG_ID,
  A2UI_EXTENSION_URI,
  A2UI_EXTENSION_URI_V08,
  A2UI_MIME_TYPE,
} from './messages';
