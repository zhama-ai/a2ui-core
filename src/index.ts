/**
 * @zhama/a2ui-core
 *
 * A2UI Protocol Core Library - v0.9
 * 严格按照 A2UI v0.9 官方规范
 *
 * @see https://a2ui.org/
 */

// ============================================================================
// Types
// ============================================================================

export type {
  // Primitives
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
  // Action
  Action,
  ActionEvent,
  // Components
  ComponentCommon,
  CatalogComponentCommon,
  ChildList,
  TextComponent,
  TextVariant,
  ImageComponent,
  ImageVariant,
  IconComponent,
  CustomIconPath,
  StandardIconName,
  VideoComponent,
  AudioPlayerComponent,
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
  // Theme
  Theme,
  // Messages
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
  // Data Types
  DataValue,
  DataObject,
  DataArray,
  // v0.9 Client types
  FunctionDefinition,
  Catalog,
  ClientCapabilities,
  ClientDataModel,
} from './types';

export {
  STANDARD_CATALOG_ID,
  isCreateSurfaceMessage,
  isUpdateComponentsMessage,
  isUpdateDataModelMessage,
  isDeleteSurfaceMessage,
  isActionMessage,
  isErrorMessage,
} from './types';

// ============================================================================
// Builders
// ============================================================================

export {
  // ID Generator
  generateId,
  resetIdCounter,
  getIdCounter,
  // Types
  type ComponentOptions,
  type CheckableOptions,
  type TextOptions,
  type ImageOptions,
  type IconOptions,
  type VideoOptions,
  type AudioPlayerOptions,
  type LayoutOptions,
  type ListOptions,
  type CardOptions,
  type TabInput,
  type TabsOptions,
  type DividerOptions,
  type ModalOptions,
  type ButtonOptions,
  type CheckBoxOptions,
  type TextFieldOptions,
  type DateTimeInputOptions,
  type ChoicePickerOptions,
  type SliderOptions,
  type ChartOptions,
  type CreateSurfaceOptions,
  // Action
  eventAction,
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
  // Extension Components
  chart,
  lineChart,
  barChart,
  pieChart,
  // Convenience
  textButton,
  h1,
  h2,
  h3,
  h4,
  h5,
  caption,
  body,
  // Messages
  createSurface,
  updateComponents,
  updateDataModel,
  deleteSurface,
  createMessages,
  messagesToJsonl,
  jsonlToMessages,
  // Data Model
  type PathMappings,
  type UpdateDataItem,
  DEFAULT_PATH_MAPPINGS,
  normalizePath,
} from './builders';

// ============================================================================
// Validators
// ============================================================================

export {
  type ValidationResult,
  type ValidationError,
  type ValidationWarning,
  type ValidationOptions,
  validateMessage,
  validateMessages,
} from './validators';

// ============================================================================
// Utils
// ============================================================================

export { isDataBinding, getLiteralValue, getPathValue, path, deepMerge, uuid } from './utils';

// ============================================================================
// Surface
// ============================================================================

export {
  SURFACE_IDS,
  type SurfaceIdType,
  type SurfaceConfig,
  generateSurfaceId,
  resetSurfaceIdCounter,
  type SurfaceResult,
  type SurfaceOptions,
  createA2UISurface,
  createA2UISurfaceWithData,
  createDeleteSurfaceMessage,
  createChatSurface,
  createRecommendationSurface,
  createInputFormSurface,
  createOrchestrationSurface,
  createStatusSurface,
} from './surface';
