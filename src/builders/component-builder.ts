/**
 * Component Builder
 *
 * 提供 A2UI 组件定义的构建工具函数
 * 用于创建符合 A2UI v0.9 协议的组件结构
 */

import type {
  ComponentInstance,
  Action,
  TextComponent,
  ImageComponent,
  RowComponent,
  ListComponent,
  DividerComponent,
  TextFieldComponent,
  ChoicePickerComponent,
  ChildrenProperty,
  StringOrPath,
  NumberOrPath,
  BooleanOrPath,
  StringArrayOrPath,
  ChartType,
  ChartSeries,
  ChartAxisConfig,
} from '../types';

import { generateId } from './id-generator';

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 组件构建选项基类
 */
export interface ComponentOptions {
  /** 组件 ID（可选，自动生成） */
  id?: string;
  /** 在 Row/Column 中的权重 */
  weight?: number;
  /** 额外的 CSS 类名（A2UI 工具类或自定义类） */
  classes?: string[];
}

/**
 * Text 组件选项
 */
export interface TextOptions extends ComponentOptions {
  usageHint?: TextComponent['usageHint'];
}

/**
 * Image 组件选项
 */
export interface ImageOptions extends ComponentOptions {
  fit?: ImageComponent['fit'];
  usageHint?: ImageComponent['usageHint'];
}

/**
 * Icon 组件选项
 */
export type IconOptions = ComponentOptions;

/**
 * Video 组件选项
 */
export type VideoOptions = ComponentOptions;

/**
 * AudioPlayer 组件选项
 */
export interface AudioPlayerOptions extends ComponentOptions {
  description?: StringOrPath;
}

/**
 * 布局组件选项
 */
export interface LayoutOptions extends ComponentOptions {
  alignment?: RowComponent['alignment'];
  distribution?: RowComponent['distribution'];
}

/**
 * List 组件选项
 */
export interface ListOptions extends ComponentOptions {
  direction?: ListComponent['direction'];
  alignment?: ListComponent['alignment'];
}

/**
 * Card 组件选项
 */
export type CardOptions = ComponentOptions;

/**
 * Tabs 组件选项
 */
export type TabsOptions = ComponentOptions;

/**
 * Tab 项目
 */
export interface TabItem {
  title: string;
  childId: string;
}

/**
 * Divider 组件选项
 */
export interface DividerOptions extends ComponentOptions {
  axis?: DividerComponent['axis'];
}

/**
 * Modal 组件选项
 */
export type ModalOptions = ComponentOptions;

/**
 * Button 组件选项
 */
export interface ButtonOptions extends ComponentOptions {
  primary?: boolean;
}

/**
 * CheckBox 组件选项
 */
export type CheckBoxOptions = ComponentOptions;

/**
 * TextField 组件选项
 */
export interface TextFieldOptions extends ComponentOptions {
  usageHint?: TextFieldComponent['usageHint'];
  validationRegexp?: string;
}

/**
 * DateTimeInput 组件选项
 */
export interface DateTimeInputOptions extends ComponentOptions {
  enableDate?: boolean;
  enableTime?: boolean;
  outputFormat?: string;
  label?: StringOrPath;
}

/**
 * ChoicePicker 组件选项
 */
export interface ChoicePickerOptions extends ComponentOptions {
  label?: StringOrPath;
}

/**
 * Slider 组件选项
 */
export interface SliderOptions extends ComponentOptions {
  label?: StringOrPath;
  min?: number;
  max?: number;
}

/**
 * Chart 组件选项
 */
export interface ChartOptions extends ComponentOptions {
  title?: StringOrPath;
  xAxis?: ChartAxisConfig;
  yAxis?: ChartAxisConfig;
  legend?: boolean;
  tooltip?: boolean;
  height?: number;
  width?: number | string;
  echartsOption?: Record<string, unknown> | { path: string };
}

// ============================================================================
// 内容组件
// ============================================================================

/**
 * 创建 Text 组件
 *
 * @param text - 文本内容或数据路径
 * @param options - 组件选项
 *
 * @example
 * // 静态文本
 * text('Hello World', { usageHint: 'h1' });
 *
 * // 数据绑定
 * text({ path: '/user/name' });
 */
export function text(content: StringOrPath, options: TextOptions = {}): ComponentInstance {
  const { id = generateId('text'), weight, usageHint, classes } = options;
  return {
    id,
    component: 'Text',
    text: content,
    ...(weight !== undefined && { weight }),
    ...(usageHint && { usageHint }),
    ...(classes && classes.length > 0 && { classes }),
  };
}

/**
 * 创建 Image 组件
 *
 * @param url - 图片 URL 或数据路径
 * @param options - 组件选项
 */
export function image(url: StringOrPath, options: ImageOptions = {}): ComponentInstance {
  const { id = generateId('image'), weight, fit, usageHint } = options;
  return {
    id,
    component: 'Image',
    url,
    ...(weight !== undefined && { weight }),
    ...(fit && { fit }),
    ...(usageHint && { usageHint }),
  };
}

/**
 * 创建 Icon 组件
 *
 * @param name - 图标名称或数据路径
 * @param options - 组件选项
 */
export function icon(name: StringOrPath, options: IconOptions = {}): ComponentInstance {
  const { id = generateId('icon'), weight } = options;
  return {
    id,
    component: 'Icon',
    name,
    ...(weight !== undefined && { weight }),
  };
}

/**
 * 创建 Video 组件
 *
 * @param url - 视频 URL 或数据路径
 * @param options - 组件选项
 */
export function video(url: StringOrPath, options: VideoOptions = {}): ComponentInstance {
  const { id = generateId('video'), weight } = options;
  return {
    id,
    component: 'Video',
    url,
    ...(weight !== undefined && { weight }),
  };
}

/**
 * 创建 AudioPlayer 组件
 *
 * @param url - 音频 URL 或数据路径
 * @param options - 组件选项
 */
export function audioPlayer(
  url: StringOrPath,
  options: AudioPlayerOptions = {}
): ComponentInstance {
  const { id = generateId('audio'), weight, description } = options;
  return {
    id,
    component: 'AudioPlayer',
    url,
    ...(weight !== undefined && { weight }),
    ...(description && { description }),
  };
}

// ============================================================================
// 布局组件
// ============================================================================

/**
 * 创建 Row 组件（水平布局）
 *
 * @param children - 子组件 ID 列表或动态模板
 * @param options - 布局选项
 *
 * @example
 * // 静态子组件
 * row(['text1', 'text2', 'button1']);
 *
 * // 动态模板
 * row({ componentId: 'itemTemplate', path: '/items' });
 */
export function row(children: ChildrenProperty, options: LayoutOptions = {}): ComponentInstance {
  const { id = generateId('row'), weight, alignment, distribution } = options;
  return {
    id,
    component: 'Row',
    children,
    ...(weight !== undefined && { weight }),
    ...(alignment && { alignment }),
    ...(distribution && { distribution }),
  };
}

/**
 * 创建 Column 组件（垂直布局）
 *
 * @param children - 子组件 ID 列表或动态模板
 * @param options - 布局选项
 */
export function column(children: ChildrenProperty, options: LayoutOptions = {}): ComponentInstance {
  const { id = generateId('column'), weight, alignment, distribution, classes } = options;
  return {
    id,
    component: 'Column',
    children,
    ...(weight !== undefined && { weight }),
    ...(alignment && { alignment }),
    ...(distribution && { distribution }),
    ...(classes && classes.length > 0 && { classes }),
  };
}

/**
 * 创建 List 组件
 *
 * @param children - 子组件 ID 列表或动态模板
 * @param options - 列表选项
 */
export function list(children: ChildrenProperty, options: ListOptions = {}): ComponentInstance {
  const { id = generateId('list'), weight, direction, alignment } = options;
  return {
    id,
    component: 'List',
    children,
    ...(weight !== undefined && { weight }),
    ...(direction && { direction }),
    ...(alignment && { alignment }),
  };
}

/**
 * 创建 Card 组件
 *
 * @param childId - 子组件 ID
 * @param options - 卡片选项
 */
export function card(childId: string, options: CardOptions = {}): ComponentInstance {
  const { id = generateId('card'), weight, classes } = options;
  return {
    id,
    component: 'Card',
    child: childId,
    ...(weight !== undefined && { weight }),
    ...(classes && classes.length > 0 && { classes }),
  };
}

/**
 * 创建 Tabs 组件
 *
 * @param items - 标签项列表
 * @param options - Tabs 选项
 */
export function tabs(items: TabItem[], options: TabsOptions = {}): ComponentInstance {
  const { id = generateId('tabs'), weight } = options;
  return {
    id,
    component: 'Tabs',
    tabItems: items.map((item) => ({
      title: item.title,
      child: item.childId,
    })),
    ...(weight !== undefined && { weight }),
  };
}

/**
 * 创建 Divider 组件
 *
 * @param options - 分割线选项
 */
export function divider(options: DividerOptions = {}): ComponentInstance {
  const { id = generateId('divider'), weight, axis } = options;
  return {
    id,
    component: 'Divider',
    ...(weight !== undefined && { weight }),
    ...(axis && { axis }),
  };
}

/**
 * 创建 Modal 组件
 *
 * @param entryPointChildId - 触发模态框的组件 ID
 * @param contentChildId - 模态框内容组件 ID
 * @param options - Modal 选项
 */
export function modal(
  entryPointChildId: string,
  contentChildId: string,
  options: ModalOptions = {}
): ComponentInstance {
  const { id = generateId('modal'), weight } = options;
  return {
    id,
    component: 'Modal',
    entryPointChild: entryPointChildId,
    contentChild: contentChildId,
    ...(weight !== undefined && { weight }),
  };
}

// ============================================================================
// 交互组件
// ============================================================================

/**
 * 创建 Button 组件
 *
 * @param childId - 按钮内容组件 ID（通常是 Text）
 * @param action - 点击时触发的操作
 * @param options - 按钮选项
 */
export function button(
  childId: string,
  action: Action,
  options: ButtonOptions = {}
): ComponentInstance {
  const { id = generateId('button'), weight, primary } = options;
  return {
    id,
    component: 'Button',
    child: childId,
    action,
    ...(weight !== undefined && { weight }),
    ...(primary !== undefined && { primary }),
  };
}

/**
 * 创建 CheckBox 组件
 *
 * @param label - 标签
 * @param value - 值（布尔值或数据路径）
 * @param options - 选项
 */
export function checkbox(
  label: StringOrPath,
  value: BooleanOrPath,
  options: CheckBoxOptions = {}
): ComponentInstance {
  const { id = generateId('checkbox'), weight } = options;
  return {
    id,
    component: 'CheckBox',
    label,
    value,
    ...(weight !== undefined && { weight }),
  };
}

/**
 * 创建 TextField 组件
 *
 * @param label - 标签
 * @param textValue - 值（可选）
 * @param options - 选项
 */
export function textField(
  label: StringOrPath,
  textValue?: StringOrPath,
  options: TextFieldOptions = {}
): ComponentInstance {
  const { id = generateId('textfield'), weight, usageHint, validationRegexp } = options;
  return {
    id,
    component: 'TextField',
    label,
    ...(textValue !== undefined && { text: textValue }),
    ...(weight !== undefined && { weight }),
    ...(usageHint && { usageHint }),
    ...(validationRegexp && { validationRegexp }),
  };
}

/**
 * 创建 DateTimeInput 组件
 *
 * @param value - 值（ISO 8601 格式字符串或数据路径）
 * @param options - 选项
 */
export function dateTimeInput(
  value: StringOrPath,
  options: DateTimeInputOptions = {}
): ComponentInstance {
  const {
    id = generateId('datetime'),
    weight,
    enableDate,
    enableTime,
    outputFormat,
    label,
  } = options;
  return {
    id,
    component: 'DateTimeInput',
    value,
    ...(weight !== undefined && { weight }),
    ...(enableDate !== undefined && { enableDate }),
    ...(enableTime !== undefined && { enableTime }),
    ...(outputFormat && { outputFormat }),
    ...(label && { label }),
  };
}

/**
 * 创建 ChoicePicker 组件
 *
 * @param optionsList - 选项列表
 * @param value - 当前选中值
 * @param usageHint - 使用提示
 * @param options - 组件选项
 */
export function choicePicker(
  optionsList: Array<{ label: StringOrPath; value: string }>,
  value: StringArrayOrPath,
  usageHint: ChoicePickerComponent['usageHint'],
  options: ChoicePickerOptions = {}
): ComponentInstance {
  const { id = generateId('choice'), weight, label } = options;
  return {
    id,
    component: 'ChoicePicker',
    options: optionsList,
    value,
    usageHint,
    ...(weight !== undefined && { weight }),
    ...(label && { label }),
  };
}

/**
 * 创建 Slider 组件
 *
 * @param value - 当前值
 * @param options - 选项
 */
export function slider(value: NumberOrPath, options: SliderOptions = {}): ComponentInstance {
  const { id = generateId('slider'), weight, label, min, max } = options;
  return {
    id,
    component: 'Slider',
    value,
    ...(weight !== undefined && { weight }),
    ...(label && { label }),
    ...(min !== undefined && { min }),
    ...(max !== undefined && { max }),
  };
}

// ============================================================================
// 数据可视化组件
// ============================================================================

/**
 * 创建 Chart 组件
 *
 * @param chartType - 图表类型
 * @param series - 数据系列
 * @param options - 组件选项
 *
 * @example
 * // 简单折线图
 * chart('line', [
 *   { name: '销售额', data: [120, 200, 150, 80, 70, 110, 130] }
 * ], {
 *   title: '月度销售趋势',
 *   xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }
 * });
 *
 * // 数据绑定
 * chart('bar', { path: '/chart/series' }, {
 *   title: { path: '/chart/title' },
 *   xAxis: { type: 'category', data: { path: '/chart/categories' } }
 * });
 */
export function chart(
  chartType: ChartType,
  series: ChartSeries[] | { path: string },
  options: ChartOptions = {}
): ComponentInstance {
  const {
    id = generateId('chart'),
    weight,
    title,
    xAxis,
    yAxis,
    legend,
    tooltip,
    height,
    width,
    echartsOption,
  } = options;

  return {
    id,
    component: 'Chart',
    chartType,
    series,
    ...(weight !== undefined && { weight }),
    ...(title && { title }),
    ...(xAxis && { xAxis }),
    ...(yAxis && { yAxis }),
    ...(legend !== undefined && { legend }),
    ...(tooltip !== undefined && { tooltip }),
    ...(height !== undefined && { height }),
    ...(width !== undefined && { width }),
    ...(echartsOption && { echartsOption }),
  };
}

/**
 * 创建折线图组件（便捷函数）
 */
export function lineChart(
  series: ChartSeries[] | { path: string },
  options: ChartOptions = {}
): ComponentInstance {
  return chart('line', series, options);
}

/**
 * 创建柱状图组件（便捷函数）
 */
export function barChart(
  series: ChartSeries[] | { path: string },
  options: ChartOptions = {}
): ComponentInstance {
  return chart('bar', series, options);
}

/**
 * 创建饼图组件（便捷函数）
 */
export function pieChart(
  series: ChartSeries[] | { path: string },
  options: ChartOptions = {}
): ComponentInstance {
  return chart('pie', series, options);
}

// ============================================================================
// 便捷组件构建器
// ============================================================================

/**
 * 创建带文本的按钮（返回按钮和文本组件）
 *
 * @param buttonText - 按钮文本
 * @param action - 点击操作
 * @param options - 按钮选项
 * @returns 包含按钮和文本组件的数组
 */
export function textButton(
  buttonText: string,
  action: Action,
  options: ButtonOptions & { textId?: string } = {}
): [ComponentInstance, ComponentInstance] {
  const textId = options.textId ?? generateId('btn_text');
  const textComp = text(buttonText, { id: textId });
  const buttonComp = button(textId, action, options);
  return [textComp, buttonComp];
}

/**
 * 创建标题组件
 */
export function h1(
  content: StringOrPath,
  options: Omit<TextOptions, 'usageHint'> = {}
): ComponentInstance {
  return text(content, { ...options, usageHint: 'h1' });
}

export function h2(
  content: StringOrPath,
  options: Omit<TextOptions, 'usageHint'> = {}
): ComponentInstance {
  return text(content, { ...options, usageHint: 'h2' });
}

export function h3(
  content: StringOrPath,
  options: Omit<TextOptions, 'usageHint'> = {}
): ComponentInstance {
  return text(content, { ...options, usageHint: 'h3' });
}

export function h4(
  content: StringOrPath,
  options: Omit<TextOptions, 'usageHint'> = {}
): ComponentInstance {
  return text(content, { ...options, usageHint: 'h4' });
}

export function h5(
  content: StringOrPath,
  options: Omit<TextOptions, 'usageHint'> = {}
): ComponentInstance {
  return text(content, { ...options, usageHint: 'h5' });
}

export function caption(
  content: StringOrPath,
  options: Omit<TextOptions, 'usageHint'> = {}
): ComponentInstance {
  return text(content, { ...options, usageHint: 'caption' });
}

export function body(
  content: StringOrPath,
  options: Omit<TextOptions, 'usageHint'> = {}
): ComponentInstance {
  return text(content, { ...options, usageHint: 'body' });
}
