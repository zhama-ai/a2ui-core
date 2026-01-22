/**
 * A2UI Component Types
 *
 * 组件类型定义，严格按照 A2UI v0.9 官方规范
 * @see https://a2ui.dev/specification/v0_9/standard_catalog.json
 */

import type {
  DataBinding,
  DynamicString,
  DynamicNumber,
  DynamicBoolean,
  DynamicStringList,
  DynamicValue,
  FunctionCall,
  AccessibilityAttributes,
  Checkable,
} from './primitives';

// ============================================================================
// Action
// ============================================================================

/**
 * 服务器端事件
 * @see common_types.json#/$defs/Action (event variant)
 */
export interface ActionEvent {
  /**
   * 操作名称
   */
  name: string;
  /**
   * 操作上下文
   */
  context?: Record<string, DynamicValue>;
}

/**
 * 操作定义
 * @see common_types.json#/$defs/Action
 */
export type Action = { event: ActionEvent } | { functionCall: FunctionCall };

// ============================================================================
// ComponentCommon
// ============================================================================

/**
 * 组件公共属性
 * @see common_types.json#/$defs/ComponentCommon
 */
export interface ComponentCommon {
  /**
   * 组件唯一标识符
   */
  id: string;
  /**
   * 无障碍属性
   */
  accessibility?: AccessibilityAttributes;
}

/**
 * Catalog 组件公共属性
 * @see standard_catalog.json#/$defs/CatalogComponentCommon
 */
export interface CatalogComponentCommon {
  /**
   * 在 Row 或 Column 中的相对权重（类似 CSS flex-grow）
   * 注意：仅当组件是 Row 或 Column 的直接子组件时才可设置
   */
  weight?: number;
}

// ============================================================================
// ChildList
// ============================================================================

/**
 * 子组件列表
 * @see common_types.json#/$defs/ChildList
 */
export type ChildList =
  | string[] // 静态子组件 ID 列表
  | {
      // 动态模板
      componentId: string;
      path: string;
    };

// ============================================================================
// Content Components
// ============================================================================

/**
 * Text 组件
 * @see standard_catalog.json#/components/Text
 */
export interface TextComponent extends ComponentCommon, CatalogComponentCommon {
  component: 'Text';
  /**
   * 文本内容（支持简单 Markdown）
   */
  text: DynamicString;
  /**
   * 文本样式变体
   */
  variant?: TextVariant;
}

/**
 * Text 组件变体
 */
export type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'caption' | 'body';

/**
 * Image 组件
 * @see standard_catalog.json#/components/Image
 */
export interface ImageComponent extends ComponentCommon, CatalogComponentCommon {
  component: 'Image';
  /**
   * 图片 URL
   */
  url: DynamicString;
  /**
   * 图片缩放模式（对应 CSS object-fit）
   */
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  /**
   * 图片样式变体
   */
  variant?: ImageVariant;
}

/**
 * Image 组件变体
 */
export type ImageVariant =
  | 'icon'
  | 'avatar'
  | 'smallFeature'
  | 'mediumFeature'
  | 'largeFeature'
  | 'header';

/**
 * 自定义 SVG 路径
 * @see standard_catalog.json#/components/Icon/name (path variant)
 */
export interface CustomIconPath {
  path: string;
}

/**
 * Icon 组件
 * @see standard_catalog.json#/components/Icon
 */
export interface IconComponent extends ComponentCommon, CatalogComponentCommon {
  component: 'Icon';
  /**
   * 图标名称
   * - 标准图标名称字符串: "accountCircle"
   * - 自定义 SVG 路径对象: { path: "M12 2L..." }
   * - 数据绑定: { path: "/iconName" } (用于动态绑定)
   */
  name: StandardIconName | CustomIconPath | DataBinding;
}

/**
 * 标准图标名称
 * @see standard_catalog.json#/components/Icon/name
 */
export type StandardIconName =
  | 'accountCircle'
  | 'add'
  | 'arrowBack'
  | 'arrowForward'
  | 'attachFile'
  | 'calendarToday'
  | 'call'
  | 'camera'
  | 'check'
  | 'close'
  | 'delete'
  | 'download'
  | 'edit'
  | 'event'
  | 'error'
  | 'fastForward'
  | 'favorite'
  | 'favoriteOff'
  | 'folder'
  | 'help'
  | 'home'
  | 'info'
  | 'locationOn'
  | 'lock'
  | 'lockOpen'
  | 'mail'
  | 'menu'
  | 'moreVert'
  | 'moreHoriz'
  | 'notificationsOff'
  | 'notifications'
  | 'pause'
  | 'payment'
  | 'person'
  | 'phone'
  | 'photo'
  | 'play'
  | 'print'
  | 'refresh'
  | 'rewind'
  | 'search'
  | 'send'
  | 'settings'
  | 'share'
  | 'shoppingCart'
  | 'skipNext'
  | 'skipPrevious'
  | 'star'
  | 'starHalf'
  | 'starOff'
  | 'stop'
  | 'upload'
  | 'visibility'
  | 'visibilityOff'
  | 'volumeDown'
  | 'volumeMute'
  | 'volumeOff'
  | 'volumeUp'
  | 'warning';

/**
 * Video 组件
 * @see standard_catalog.json#/components/Video
 */
export interface VideoComponent extends ComponentCommon, CatalogComponentCommon {
  component: 'Video';
  /**
   * 视频 URL
   */
  url: DynamicString;
}

/**
 * AudioPlayer 组件
 * @see standard_catalog.json#/components/AudioPlayer
 */
export interface AudioPlayerComponent extends ComponentCommon, CatalogComponentCommon {
  component: 'AudioPlayer';
  /**
   * 音频 URL
   */
  url: DynamicString;
  /**
   * 音频描述（如标题或摘要）
   */
  description?: DynamicString;
}

// ============================================================================
// Layout Components
// ============================================================================

/**
 * 主轴分布方式
 */
export type JustifyContent =
  | 'start'
  | 'center'
  | 'end'
  | 'spaceBetween'
  | 'spaceAround'
  | 'spaceEvenly'
  | 'stretch';

/**
 * 交叉轴对齐方式
 */
export type AlignItems = 'start' | 'center' | 'end' | 'stretch';

/**
 * Row 组件（水平布局）
 * @see standard_catalog.json#/components/Row
 */
export interface RowComponent extends ComponentCommon, CatalogComponentCommon {
  component: 'Row';
  /**
   * 子组件列表
   */
  children: ChildList;
  /**
   * 主轴（水平）分布方式
   */
  justify?: JustifyContent;
  /**
   * 交叉轴（垂直）对齐方式
   */
  align?: AlignItems;
}

/**
 * Column 组件（垂直布局）
 * @see standard_catalog.json#/components/Column
 */
export interface ColumnComponent extends ComponentCommon, CatalogComponentCommon {
  component: 'Column';
  /**
   * 子组件列表
   */
  children: ChildList;
  /**
   * 主轴（垂直）分布方式
   */
  justify?: JustifyContent;
  /**
   * 交叉轴（水平）对齐方式
   */
  align?: AlignItems;
}

/**
 * List 组件
 * @see standard_catalog.json#/components/List
 */
export interface ListComponent extends ComponentCommon, CatalogComponentCommon {
  component: 'List';
  /**
   * 子组件列表
   */
  children: ChildList;
  /**
   * 列表方向
   */
  direction?: 'vertical' | 'horizontal';
  /**
   * 交叉轴对齐方式
   */
  align?: AlignItems;
}

/**
 * Card 组件
 * @see standard_catalog.json#/components/Card
 */
export interface CardComponent extends ComponentCommon, CatalogComponentCommon {
  component: 'Card';
  /**
   * 子组件 ID
   */
  child: string;
}

/**
 * Tab 项目
 * @see standard_catalog.json#/components/Tabs/tabs/items
 */
export interface TabItem {
  /**
   * 标签页标题
   */
  title: DynamicString;
  /**
   * 标签页内容组件 ID
   */
  child: string;
}

/**
 * Tabs 组件
 * @see standard_catalog.json#/components/Tabs
 */
export interface TabsComponent extends ComponentCommon, CatalogComponentCommon {
  component: 'Tabs';
  /**
   * 标签页列表
   */
  tabs: TabItem[];
}

/**
 * Modal 组件
 * @see standard_catalog.json#/components/Modal
 */
export interface ModalComponent extends ComponentCommon, CatalogComponentCommon {
  component: 'Modal';
  /**
   * 触发模态框的组件 ID
   */
  trigger: string;
  /**
   * 模态框内容组件 ID
   */
  content: string;
}

/**
 * Divider 组件
 * @see standard_catalog.json#/components/Divider
 */
export interface DividerComponent extends ComponentCommon, CatalogComponentCommon {
  component: 'Divider';
  /**
   * 分割线方向
   * @default "horizontal"
   */
  axis?: 'horizontal' | 'vertical';
}

// ============================================================================
// Interactive Components
// ============================================================================

/**
 * Button 组件
 * @see standard_catalog.json#/components/Button
 */
export interface ButtonComponent extends ComponentCommon, CatalogComponentCommon, Checkable {
  component: 'Button';
  /**
   * 按钮内容组件 ID
   */
  child: string;
  /**
   * 点击操作
   */
  action: Action;
  /**
   * 按钮样式变体
   */
  variant?: ButtonVariant;
}

/**
 * Button 组件变体
 */
export type ButtonVariant = 'primary' | 'borderless';

/**
 * CheckBox 组件
 * @see standard_catalog.json#/components/CheckBox
 */
export interface CheckBoxComponent extends ComponentCommon, CatalogComponentCommon, Checkable {
  component: 'CheckBox';
  /**
   * 复选框标签
   */
  label: DynamicString;
  /**
   * 复选框值
   */
  value: DynamicBoolean;
}

/**
 * TextField 组件
 * @see standard_catalog.json#/components/TextField
 */
export interface TextFieldComponent extends ComponentCommon, CatalogComponentCommon, Checkable {
  component: 'TextField';
  /**
   * 输入框标签
   */
  label: DynamicString;
  /**
   * 输入框值
   */
  value?: DynamicString;
  /**
   * 输入框类型变体
   */
  variant?: TextFieldVariant;
}

/**
 * TextField 组件变体
 */
export type TextFieldVariant = 'longText' | 'number' | 'shortText' | 'obscured';

/**
 * DateTimeInput 组件
 * @see standard_catalog.json#/components/DateTimeInput
 */
export interface DateTimeInputComponent extends ComponentCommon, CatalogComponentCommon, Checkable {
  component: 'DateTimeInput';
  /**
   * 日期/时间值（ISO 8601 格式）
   */
  value: DynamicString;
  /**
   * 是否允许选择日期
   */
  enableDate?: boolean;
  /**
   * 是否允许选择时间
   */
  enableTime?: boolean;
  /**
   * 最小允许日期/时间（ISO 8601 格式）
   */
  min?: DynamicString;
  /**
   * 最大允许日期/时间（ISO 8601 格式）
   */
  max?: DynamicString;
  /**
   * 输入框标签
   */
  label?: DynamicString;
}

/**
 * 选项定义
 * @see standard_catalog.json#/components/ChoicePicker/options/items
 */
export interface ChoiceOption {
  /**
   * 选项显示文本
   */
  label: DynamicString;
  /**
   * 选项值
   */
  value: string;
}

/**
 * ChoicePicker 组件
 * @see standard_catalog.json#/components/ChoicePicker
 */
export interface ChoicePickerComponent extends ComponentCommon, CatalogComponentCommon, Checkable {
  component: 'ChoicePicker';
  /**
   * 选项列表
   */
  options: ChoiceOption[];
  /**
   * 当前选中值列表
   */
  value: DynamicStringList;
  /**
   * 选项组标签
   */
  label?: DynamicString;
  /**
   * 选择器类型变体
   */
  variant?: ChoicePickerVariant;
}

/**
 * ChoicePicker 组件变体
 */
export type ChoicePickerVariant = 'multipleSelection' | 'mutuallyExclusive';

/**
 * Slider 组件
 * @see standard_catalog.json#/components/Slider
 */
export interface SliderComponent extends ComponentCommon, CatalogComponentCommon, Checkable {
  component: 'Slider';
  /**
   * 当前值
   */
  value: DynamicNumber;
  /**
   * 最小值（必需）
   */
  min: number;
  /**
   * 最大值（必需）
   */
  max: number;
  /**
   * 滑块标签
   */
  label?: DynamicString;
}

// ============================================================================
// Extension Components (非标准)
// ============================================================================

/**
 * Chart 组件（扩展，非 A2UI 标准）
 * @extension
 */
export interface ChartComponent extends ComponentCommon, CatalogComponentCommon {
  component: 'Chart';
  chartType: ChartType;
  series: ChartSeries[] | DataBinding;
  title?: DynamicString;
  xAxis?: ChartAxisConfig;
  yAxis?: ChartAxisConfig;
  legend?: boolean;
  tooltip?: boolean;
  height?: number;
  width?: number | string;
  echartsOption?: Record<string, unknown> | DataBinding;
}

export type ChartType = 'line' | 'bar' | 'pie' | 'scatter' | 'area' | 'radar' | 'custom';

export interface ChartSeries {
  name?: string;
  data: (number | [number, number] | Record<string, unknown>)[] | DataBinding;
  type?: string;
  color?: string;
  [key: string]: unknown;
}

export interface ChartAxisConfig {
  type?: 'category' | 'value' | 'time' | 'log';
  data?: string[] | DataBinding;
  name?: string;
  min?: number | 'auto';
  max?: number | 'auto';
  [key: string]: unknown;
}

// ============================================================================
// Union Types
// ============================================================================

/**
 * 标准组件类型
 */
export type StandardComponent =
  | TextComponent
  | ImageComponent
  | IconComponent
  | VideoComponent
  | AudioPlayerComponent
  | RowComponent
  | ColumnComponent
  | ListComponent
  | CardComponent
  | TabsComponent
  | ModalComponent
  | DividerComponent
  | ButtonComponent
  | CheckBoxComponent
  | TextFieldComponent
  | DateTimeInputComponent
  | ChoicePickerComponent
  | SliderComponent;

/**
 * 所有组件类型（包括扩展）
 */
export type AnyComponent = StandardComponent | ChartComponent;

/**
 * 组件类型名称
 */
export type ComponentType = AnyComponent['component'];

/**
 * 组件实例（松散类型，用于运行时）
 */
export interface ComponentInstance extends Record<string, unknown> {
  id: string;
  component: string;
}
