/**
 * A2UI Builders - v0.9
 */

// ID Generator
export { generateId, resetIdCounter, getIdCounter } from './id-generator';

// Component Builder
export {
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
  eventAction,
  text,
  image,
  icon,
  video,
  audioPlayer,
  row,
  column,
  list,
  card,
  tabs,
  divider,
  modal,
  button,
  checkbox,
  textField,
  dateTimeInput,
  choicePicker,
  slider,
  chart,
  lineChart,
  barChart,
  pieChart,
  textButton,
  h1,
  h2,
  h3,
  h4,
  h5,
  caption,
  body,
} from './component-builder';

// Message Builder
export {
  type CreateSurfaceOptions,
  createSurface,
  updateComponents,
  updateDataModel,
  deleteSurface,
  createMessages,
  messagesToJsonl,
  jsonlToMessages,
} from './message-builder';

// Data Model Builder
export {
  type PathMappings,
  type UpdateDataItem,
  DEFAULT_PATH_MAPPINGS,
  normalizePath,
} from './data-model-builder';
