/**
 * A2UI Types Module - v0.9
 *
 * 导出所有 A2UI v0.9 协议相关的类型定义
 */

// Primitives
export type {
  StringOrPath,
  NumberOrPath,
  BooleanOrPath,
  StringArrayOrPath,
  ContextValue,
} from './primitives';

// Components
export type {
  // Action
  Action,
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
  // Data visualization components
  ChartComponent,
  ChartType,
  ChartSeries,
  ChartAxisConfig,
  // Union types
  AnyComponent,
  ComponentType,
  ComponentInstance,
} from './components';

// Messages (v0.9 only)
export type {
  // Theme
  Theme,
  // Server to Client (v0.9)
  CreateSurfaceMessage,
  UpdateComponentsMessage,
  UpdateDataModelMessage,
  DeleteSurfaceMessage,
  ServerToClientMessageV09,
  // Client to Server
  UserActionEvent,
  DataChangeEvent,
  ClientErrorMessage,
  ValidationFailedError,
  GenericError,
  ClientToServerMessage,
  // Data types
  DataValue,
  DataObject,
  DataArray,
} from './messages';

export { isV09Message, STANDARD_CATALOG_ID, A2UI_EXTENSION_URI, A2UI_MIME_TYPE } from './messages';
