/**
 * A2UI Component Types
 *
 * 标准组件目录中的组件类型定义
 * Based on A2UI v0.9 specification
 */

import type { StringOrPath, NumberOrPath, BooleanOrPath, StringArrayOrPath } from './primitives';

// ============================================================================
// Action
// ============================================================================

/**
 * 用户操作定义
 * Dispatched when interactive components (like Button) are activated
 */
export interface Action {
  /**
   * 操作名称，用于标识操作类型
   * @example "submit_form", "navigate", "select_item"
   */
  name: string;

  /**
   * 操作上下文，键值对形式
   * Values can be literals or data bindings
   */
  context?: Record<string, StringOrPath | NumberOrPath | BooleanOrPath>;
}

/**
 * v0.8 格式的 Action 上下文项
 */
export interface ActionContextItem {
  key: string;
  value: {
    path?: string;
    literalString?: string;
    literalNumber?: number;
    literalBoolean?: boolean;
  };
}

/**
 * v0.8 格式的 Action
 */
export interface ActionV08 {
  name: string;
  context?: ActionContextItem[];
}

// ============================================================================
// 基础组件公共属性
// ============================================================================

/**
 * 组件公共属性
 */
export interface ComponentCommon {
  /**
   * 组件唯一标识符
   */
  id: string;

  /**
   * 在 Row 或 Column 中的相对权重（类似 CSS flex-grow）
   */
  weight?: number;

  /**
   * 额外的 CSS 类名（A2UI 工具类或自定义类）
   * @example ['a2-overflow-y-auto', 'a2-max-h-20']
   */
  classes?: string[];
}

// ============================================================================
// 内容组件
// ============================================================================

/**
 * Text 组件 - 显示文本内容
 */
export interface TextComponent {
  component: 'Text';
  /**
   * 文本内容，支持简单 Markdown
   */
  text: StringOrPath;
  /**
   * 文本样式提示
   */
  usageHint?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'caption' | 'body';
}

/**
 * Image 组件 - 显示图片
 */
export interface ImageComponent {
  component: 'Image';
  /**
   * 图片 URL
   */
  url: StringOrPath;
  /**
   * 图片适应方式
   */
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  /**
   * 图片尺寸/样式提示
   */
  usageHint?: 'icon' | 'avatar' | 'smallFeature' | 'mediumFeature' | 'largeFeature' | 'header';
}

/**
 * Icon 组件 - 显示图标
 */
export interface IconComponent {
  component: 'Icon';
  /**
   * 图标名称，支持标准图标集
   */
  name: StringOrPath;
}

/**
 * 标准图标名称
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
 * Video 组件 - 显示视频
 */
export interface VideoComponent {
  component: 'Video';
  /**
   * 视频 URL
   */
  url: StringOrPath;
}

/**
 * AudioPlayer 组件 - 音频播放器
 */
export interface AudioPlayerComponent {
  component: 'AudioPlayer';
  /**
   * 音频 URL
   */
  url: StringOrPath;
  /**
   * 音频描述/标题
   */
  description?: StringOrPath;
}

// ============================================================================
// 布局组件
// ============================================================================

/**
 * 子组件引用 - 静态列表或动态模板
 */
export type ChildrenProperty =
  | string[]
  | {
      componentId: string;
      path: string;
    };

/**
 * Row 组件 - 水平布局
 */
export interface RowComponent {
  component: 'Row';
  /**
   * 子组件 ID 列表或动态模板
   */
  children: ChildrenProperty;
  /**
   * 主轴方向上的分布方式
   */
  distribution?:
    | 'start'
    | 'center'
    | 'end'
    | 'spaceBetween'
    | 'spaceAround'
    | 'spaceEvenly'
    | 'stretch';
  /**
   * 交叉轴方向上的对齐方式
   */
  alignment?: 'start' | 'center' | 'end' | 'stretch';
}

/**
 * Column 组件 - 垂直布局
 */
export interface ColumnComponent {
  component: 'Column';
  /**
   * 子组件 ID 列表或动态模板
   */
  children: ChildrenProperty;
  /**
   * 主轴方向上的分布方式
   */
  distribution?:
    | 'start'
    | 'center'
    | 'end'
    | 'spaceBetween'
    | 'spaceAround'
    | 'spaceEvenly'
    | 'stretch';
  /**
   * 交叉轴方向上的对齐方式
   */
  alignment?: 'start' | 'center' | 'end' | 'stretch';
}

/**
 * List 组件 - 列表布局
 */
export interface ListComponent {
  component: 'List';
  /**
   * 子组件 ID 列表或动态模板
   */
  children: ChildrenProperty;
  /**
   * 列表方向
   */
  direction?: 'vertical' | 'horizontal';
  /**
   * 对齐方式
   */
  alignment?: 'start' | 'center' | 'end' | 'stretch';
}

/**
 * Card 组件 - 卡片容器
 */
export interface CardComponent {
  component: 'Card';
  /**
   * 单个子组件 ID
   */
  child: string;
}

/**
 * Tabs 组件 - 标签页
 */
export interface TabsComponent {
  component: 'Tabs';
  /**
   * 标签项列表
   */
  tabItems: Array<{
    title: StringOrPath;
    child: string;
  }>;
}

/**
 * Divider 组件 - 分割线
 */
export interface DividerComponent {
  component: 'Divider';
  /**
   * 方向
   */
  axis?: 'horizontal' | 'vertical';
}

/**
 * Modal 组件 - 模态框
 */
export interface ModalComponent {
  component: 'Modal';
  /**
   * 触发模态框的组件 ID
   */
  entryPointChild: string;
  /**
   * 模态框内容组件 ID
   */
  contentChild: string;
}

// ============================================================================
// 交互组件
// ============================================================================

/**
 * Button 组件 - 按钮
 */
export interface ButtonComponent {
  component: 'Button';
  /**
   * 按钮内容组件 ID（通常是 Text）
   */
  child: string;
  /**
   * 是否为主按钮样式
   */
  primary?: boolean;
  /**
   * 点击时触发的操作
   */
  action: Action;
}

/**
 * CheckBox 组件 - 复选框
 */
export interface CheckBoxComponent {
  component: 'CheckBox';
  /**
   * 标签文本
   */
  label: StringOrPath;
  /**
   * 选中状态
   */
  value: BooleanOrPath;
}

/**
 * TextField 组件 - 文本输入框
 */
export interface TextFieldComponent {
  component: 'TextField';
  /**
   * 输入框标签
   */
  label: StringOrPath;
  /**
   * 输入框值
   */
  text?: StringOrPath;
  /**
   * 输入类型提示
   */
  usageHint?: 'longText' | 'number' | 'shortText' | 'obscured';
  /**
   * 验证正则表达式
   */
  validationRegexp?: string;
}

/**
 * DateTimeInput 组件 - 日期时间选择器
 */
export interface DateTimeInputComponent {
  component: 'DateTimeInput';
  /**
   * 当前值（ISO 8601 格式）
   */
  value: StringOrPath;
  /**
   * 是否允许选择日期
   */
  enableDate?: boolean;
  /**
   * 是否允许选择时间
   */
  enableTime?: boolean;
  /**
   * 输出格式
   */
  outputFormat?: string;
  /**
   * 标签
   */
  label?: StringOrPath;
}

/**
 * ChoicePicker 组件 - 选择器
 */
export interface ChoicePickerComponent {
  component: 'ChoicePicker';
  /**
   * 标签
   */
  label?: StringOrPath;
  /**
   * 使用提示
   */
  usageHint: 'multipleSelection' | 'mutuallyExclusive';
  /**
   * 选项列表
   */
  options: Array<{
    label: StringOrPath;
    value: string;
  }>;
  /**
   * 当前选中的值
   */
  value: StringArrayOrPath;
}

/**
 * Slider 组件 - 滑块
 */
export interface SliderComponent {
  component: 'Slider';
  /**
   * 标签
   */
  label?: StringOrPath;
  /**
   * 最小值
   */
  min?: number;
  /**
   * 最大值
   */
  max?: number;
  /**
   * 当前值
   */
  value: NumberOrPath;
}

// ============================================================================
// 数据可视化组件
// ============================================================================

/**
 * Chart 图表类型
 */
export type ChartType = 'line' | 'bar' | 'pie' | 'scatter' | 'area' | 'radar' | 'gauge';

/**
 * Chart 数据系列
 */
export interface ChartSeries {
  /**
   * 系列名称
   */
  name?: string;
  /**
   * 系列类型（可覆盖 chartType）
   */
  type?: ChartType;
  /**
   * 数据点数组
   */
  data: number[] | Array<{ name?: string; value: number }> | { path: string };
}

/**
 * Chart 坐标轴配置
 */
export interface ChartAxisConfig {
  /**
   * 坐标轴类型
   */
  type?: 'category' | 'value' | 'time' | 'log';
  /**
   * 坐标轴数据（category 类型时使用）
   */
  data?: string[] | { path: string };
  /**
   * 坐标轴名称
   */
  name?: string;
}

/**
 * Chart 组件 - 图表可视化
 */
export interface ChartComponent {
  component: 'Chart';
  /**
   * 图表类型
   */
  chartType: ChartType;
  /**
   * 图表标题
   */
  title?: StringOrPath;
  /**
   * 数据系列
   */
  series: ChartSeries[] | { path: string };
  /**
   * X 轴配置
   */
  xAxis?: ChartAxisConfig;
  /**
   * Y 轴配置
   */
  yAxis?: ChartAxisConfig;
  /**
   * 是否显示图例
   */
  legend?: boolean;
  /**
   * 是否显示 tooltip
   */
  tooltip?: boolean;
  /**
   * 图表高度（像素）
   */
  height?: number;
  /**
   * 图表宽度（像素或百分比字符串）
   */
  width?: number | string;
  /**
   * ECharts 原生 option 扩展（高级用法）
   */
  echartsOption?: Record<string, unknown> | { path: string };
}

// ============================================================================
// 组件类型联合
// ============================================================================

/**
 * 任意标准组件类型
 */
export type AnyComponent =
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
  | DividerComponent
  | ModalComponent
  | ButtonComponent
  | CheckBoxComponent
  | TextFieldComponent
  | DateTimeInputComponent
  | ChoicePickerComponent
  | SliderComponent
  | ChartComponent;

/**
 * 组件类型名称
 */
export type ComponentType = AnyComponent['component'];

/**
 * 组件实例 - 带有 ID 和可选权重的组件
 */
export interface ComponentInstance extends ComponentCommon {
  component: string;
  [key: string]: unknown;
}
