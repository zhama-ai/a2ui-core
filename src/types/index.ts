/**
 * A2UI Types - v0.9
 *
 * 严格按照 A2UI v0.9 官方规范导出类型
 */

// ============================================================================
// Primitives
// ============================================================================

export type {
  DataBinding,
  FunctionCall,
  FunctionReturnType,
  LogicExpression,
  DynamicString,
  DynamicNumber,
  DynamicBoolean,
  DynamicStringList,
  DynamicValue,
  CheckRule,
  Checkable,
  AccessibilityAttributes,
  AccessibilityRole,
  LiveRegion,
  ContextValue,
} from './primitives';

// ============================================================================
// Components
// ============================================================================

export type {
  // Action
  Action,
  ActionEvent,
  // Common
  ComponentCommon,
  CatalogComponentCommon,
  // ChildList
  ChildList,
  // Content
  TextComponent,
  TextVariant,
  ImageComponent,
  ImageVariant,
  IconComponent,
  CustomIconPath,
  StandardIconName,
  VideoComponent,
  AudioPlayerComponent,
  // Layout
  RowComponent,
  ColumnComponent,
  ListComponent,
  CardComponent,
  TabsComponent,
  TabItem,
  DividerComponent,
  ModalComponent,
  JustifyContent,
  AlignItems,
  // Interactive
  ButtonComponent,
  ButtonVariant,
  CheckBoxComponent,
  TextFieldComponent,
  TextFieldVariant,
  DateTimeInputComponent,
  ChoicePickerComponent,
  ChoicePickerVariant,
  ChoiceOption,
  SliderComponent,
  // Extension
  ChartComponent,
  ChartType,
  ChartSeries,
  ChartAxisConfig,
  // Union types
  StandardComponent,
  AnyComponent,
  ComponentType,
  ComponentInstance,
} from './components';

// ============================================================================
// Messages
// ============================================================================

export type {
  Theme,
  CreateSurfaceMessage,
  UpdateComponentsMessage,
  UpdateDataModelMessage,
  DeleteSurfaceMessage,
  ServerToClientMessage,
  ActionMessage,
  ClientError,
  ValidationFailedError,
  GenericError,
  ClientToServerMessage,
  DataValue,
  DataObject,
  DataArray,
  // v0.9 Client types
  FunctionDefinition,
  Catalog,
  ClientCapabilities,
  ClientDataModel,
} from './messages';

export {
  STANDARD_CATALOG_ID,
  isCreateSurfaceMessage,
  isUpdateComponentsMessage,
  isUpdateDataModelMessage,
  isDeleteSurfaceMessage,
  isActionMessage,
  isErrorMessage,
} from './messages';
