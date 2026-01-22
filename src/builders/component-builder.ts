/**
 * Component Builder
 *
 * A2UI v0.9 组件构建器
 */

import type {
  ComponentInstance,
  Action,
  ActionEvent,
  TextVariant,
  ImageComponent,
  ImageVariant,
  ListComponent,
  DividerComponent,
  TextFieldVariant,
  ChoicePickerVariant,
  ChildList,
  DynamicString,
  DynamicNumber,
  DynamicBoolean,
  DynamicStringList,
  DynamicValue,
  ChartType,
  ChartSeries,
  ChartAxisConfig,
  JustifyContent,
  AlignItems,
  ButtonVariant,
  ChoiceOption,
  AccessibilityAttributes,
  CheckRule,
} from '../types';

import { generateId } from './id-generator';

// ============================================================================
// Options Types
// ============================================================================

export interface ComponentOptions {
  id?: string;
  weight?: number;
  accessibility?: AccessibilityAttributes;
}

export interface CheckableOptions {
  checks?: CheckRule[];
}

export interface TextOptions extends ComponentOptions {
  variant?: TextVariant;
}

export interface ImageOptions extends ComponentOptions {
  fit?: ImageComponent['fit'];
  variant?: ImageVariant;
}

export type IconOptions = ComponentOptions;
export type VideoOptions = ComponentOptions;

export interface AudioPlayerOptions extends ComponentOptions {
  description?: DynamicString;
}

export interface LayoutOptions extends ComponentOptions {
  align?: AlignItems;
  justify?: JustifyContent;
}

export interface ListOptions extends ComponentOptions {
  direction?: ListComponent['direction'];
  align?: AlignItems;
}

export type CardOptions = ComponentOptions;

export interface TabInput {
  title: DynamicString;
  childId: string;
}

export type TabsOptions = ComponentOptions;

export interface DividerOptions extends ComponentOptions {
  axis?: DividerComponent['axis'];
}

export type ModalOptions = ComponentOptions;

export interface ButtonOptions extends ComponentOptions, CheckableOptions {
  variant?: ButtonVariant;
}

export type CheckBoxOptions = ComponentOptions & CheckableOptions;

export interface TextFieldOptions extends ComponentOptions, CheckableOptions {
  variant?: TextFieldVariant;
}

export interface DateTimeInputOptions extends ComponentOptions, CheckableOptions {
  enableDate?: boolean;
  enableTime?: boolean;
  min?: DynamicString;
  max?: DynamicString;
  label?: DynamicString;
}

export interface ChoicePickerOptions extends ComponentOptions, CheckableOptions {
  label?: DynamicString;
  variant?: ChoicePickerVariant;
}

export interface SliderOptions extends ComponentOptions, CheckableOptions {
  label?: DynamicString;
}

export interface ChartOptions extends ComponentOptions {
  title?: DynamicString;
  xAxis?: ChartAxisConfig;
  yAxis?: ChartAxisConfig;
  legend?: boolean;
  tooltip?: boolean;
  height?: number;
  width?: number | string;
  echartsOption?: Record<string, unknown> | { path: string };
}

// ============================================================================
// Action Helpers
// ============================================================================

/**
 * 创建服务器端事件 Action
 */
export function eventAction(name: string, context?: Record<string, DynamicValue>): Action {
  const event: ActionEvent = { name };
  if (context) {
    event.context = context;
  }
  return { event };
}

// ============================================================================
// Content Components
// ============================================================================

export function text(content: DynamicString, options: TextOptions = {}): ComponentInstance {
  const { id = generateId('text'), weight, variant, accessibility } = options;
  return {
    id,
    component: 'Text',
    text: content,
    ...(weight !== undefined && { weight }),
    ...(variant && { variant }),
    ...(accessibility && { accessibility }),
  };
}

export function image(url: DynamicString, options: ImageOptions = {}): ComponentInstance {
  const { id = generateId('image'), weight, fit, variant, accessibility } = options;
  return {
    id,
    component: 'Image',
    url,
    ...(weight !== undefined && { weight }),
    ...(fit && { fit }),
    ...(variant && { variant }),
    ...(accessibility && { accessibility }),
  };
}

export function icon(name: DynamicString, options: IconOptions = {}): ComponentInstance {
  const { id = generateId('icon'), weight, accessibility } = options;
  return {
    id,
    component: 'Icon',
    name,
    ...(weight !== undefined && { weight }),
    ...(accessibility && { accessibility }),
  };
}

export function video(url: DynamicString, options: VideoOptions = {}): ComponentInstance {
  const { id = generateId('video'), weight, accessibility } = options;
  return {
    id,
    component: 'Video',
    url,
    ...(weight !== undefined && { weight }),
    ...(accessibility && { accessibility }),
  };
}

export function audioPlayer(
  url: DynamicString,
  options: AudioPlayerOptions = {}
): ComponentInstance {
  const { id = generateId('audio'), weight, description, accessibility } = options;
  return {
    id,
    component: 'AudioPlayer',
    url,
    ...(weight !== undefined && { weight }),
    ...(description && { description }),
    ...(accessibility && { accessibility }),
  };
}

// ============================================================================
// Layout Components
// ============================================================================

export function row(children: ChildList, options: LayoutOptions = {}): ComponentInstance {
  const { id = generateId('row'), weight, align, justify, accessibility } = options;
  return {
    id,
    component: 'Row',
    children,
    ...(weight !== undefined && { weight }),
    ...(align && { align }),
    ...(justify && { justify }),
    ...(accessibility && { accessibility }),
  };
}

export function column(children: ChildList, options: LayoutOptions = {}): ComponentInstance {
  const { id = generateId('column'), weight, align, justify, accessibility } = options;
  return {
    id,
    component: 'Column',
    children,
    ...(weight !== undefined && { weight }),
    ...(align && { align }),
    ...(justify && { justify }),
    ...(accessibility && { accessibility }),
  };
}

export function list(children: ChildList, options: ListOptions = {}): ComponentInstance {
  const { id = generateId('list'), weight, direction, align, accessibility } = options;
  return {
    id,
    component: 'List',
    children,
    ...(weight !== undefined && { weight }),
    ...(direction && { direction }),
    ...(align && { align }),
    ...(accessibility && { accessibility }),
  };
}

export function card(childId: string, options: CardOptions = {}): ComponentInstance {
  const { id = generateId('card'), weight, accessibility } = options;
  return {
    id,
    component: 'Card',
    child: childId,
    ...(weight !== undefined && { weight }),
    ...(accessibility && { accessibility }),
  };
}

export function tabs(items: TabInput[], options: TabsOptions = {}): ComponentInstance {
  const { id = generateId('tabs'), weight, accessibility } = options;
  return {
    id,
    component: 'Tabs',
    tabs: items.map((item) => ({
      title: item.title,
      child: item.childId,
    })),
    ...(weight !== undefined && { weight }),
    ...(accessibility && { accessibility }),
  };
}

export function divider(options: DividerOptions = {}): ComponentInstance {
  const { id = generateId('divider'), weight, axis, accessibility } = options;
  return {
    id,
    component: 'Divider',
    ...(weight !== undefined && { weight }),
    ...(axis && { axis }),
    ...(accessibility && { accessibility }),
  };
}

export function modal(
  triggerId: string,
  contentId: string,
  options: ModalOptions = {}
): ComponentInstance {
  const { id = generateId('modal'), weight, accessibility } = options;
  return {
    id,
    component: 'Modal',
    trigger: triggerId,
    content: contentId,
    ...(weight !== undefined && { weight }),
    ...(accessibility && { accessibility }),
  };
}

// ============================================================================
// Interactive Components
// ============================================================================

export function button(
  childId: string,
  action: Action,
  options: ButtonOptions = {}
): ComponentInstance {
  const { id = generateId('button'), weight, variant, checks, accessibility } = options;
  return {
    id,
    component: 'Button',
    child: childId,
    action,
    ...(weight !== undefined && { weight }),
    ...(variant && { variant }),
    ...(checks && checks.length > 0 && { checks }),
    ...(accessibility && { accessibility }),
  };
}

export function checkbox(
  label: DynamicString,
  value: DynamicBoolean,
  options: CheckBoxOptions = {}
): ComponentInstance {
  const { id = generateId('checkbox'), weight, checks, accessibility } = options;
  return {
    id,
    component: 'CheckBox',
    label,
    value,
    ...(weight !== undefined && { weight }),
    ...(checks && checks.length > 0 && { checks }),
    ...(accessibility && { accessibility }),
  };
}

export function textField(
  label: DynamicString,
  value?: DynamicString,
  options: TextFieldOptions = {}
): ComponentInstance {
  const { id = generateId('textfield'), weight, variant, checks, accessibility } = options;
  return {
    id,
    component: 'TextField',
    label,
    ...(value !== undefined && { value }),
    ...(weight !== undefined && { weight }),
    ...(variant && { variant }),
    ...(checks && checks.length > 0 && { checks }),
    ...(accessibility && { accessibility }),
  };
}

export function dateTimeInput(
  value: DynamicString,
  options: DateTimeInputOptions = {}
): ComponentInstance {
  const {
    id = generateId('datetime'),
    weight,
    enableDate,
    enableTime,
    min,
    max,
    label,
    checks,
    accessibility,
  } = options;
  return {
    id,
    component: 'DateTimeInput',
    value,
    ...(weight !== undefined && { weight }),
    ...(enableDate !== undefined && { enableDate }),
    ...(enableTime !== undefined && { enableTime }),
    ...(min && { min }),
    ...(max && { max }),
    ...(label && { label }),
    ...(checks && checks.length > 0 && { checks }),
    ...(accessibility && { accessibility }),
  };
}

export function choicePicker(
  optionsList: ChoiceOption[],
  value: DynamicStringList,
  options: ChoicePickerOptions = {}
): ComponentInstance {
  const { id = generateId('choice'), weight, label, variant, checks, accessibility } = options;
  return {
    id,
    component: 'ChoicePicker',
    options: optionsList,
    value,
    ...(weight !== undefined && { weight }),
    ...(label && { label }),
    ...(variant && { variant }),
    ...(checks && checks.length > 0 && { checks }),
    ...(accessibility && { accessibility }),
  };
}

export function slider(
  value: DynamicNumber,
  min: number,
  max: number,
  options: SliderOptions = {}
): ComponentInstance {
  const { id = generateId('slider'), weight, label, checks, accessibility } = options;
  return {
    id,
    component: 'Slider',
    value,
    min,
    max,
    ...(weight !== undefined && { weight }),
    ...(label && { label }),
    ...(checks && checks.length > 0 && { checks }),
    ...(accessibility && { accessibility }),
  };
}

// ============================================================================
// Extension Components
// ============================================================================

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
    accessibility,
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
    ...(accessibility && { accessibility }),
  };
}

export function lineChart(
  series: ChartSeries[] | { path: string },
  options: ChartOptions = {}
): ComponentInstance {
  return chart('line', series, options);
}

export function barChart(
  series: ChartSeries[] | { path: string },
  options: ChartOptions = {}
): ComponentInstance {
  return chart('bar', series, options);
}

export function pieChart(
  series: ChartSeries[] | { path: string },
  options: ChartOptions = {}
): ComponentInstance {
  return chart('pie', series, options);
}

// ============================================================================
// Convenience Builders
// ============================================================================

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

export function h1(
  content: DynamicString,
  options: Omit<TextOptions, 'variant'> = {}
): ComponentInstance {
  return text(content, { ...options, variant: 'h1' });
}

export function h2(
  content: DynamicString,
  options: Omit<TextOptions, 'variant'> = {}
): ComponentInstance {
  return text(content, { ...options, variant: 'h2' });
}

export function h3(
  content: DynamicString,
  options: Omit<TextOptions, 'variant'> = {}
): ComponentInstance {
  return text(content, { ...options, variant: 'h3' });
}

export function h4(
  content: DynamicString,
  options: Omit<TextOptions, 'variant'> = {}
): ComponentInstance {
  return text(content, { ...options, variant: 'h4' });
}

export function h5(
  content: DynamicString,
  options: Omit<TextOptions, 'variant'> = {}
): ComponentInstance {
  return text(content, { ...options, variant: 'h5' });
}

export function caption(
  content: DynamicString,
  options: Omit<TextOptions, 'variant'> = {}
): ComponentInstance {
  return text(content, { ...options, variant: 'caption' });
}

export function body(
  content: DynamicString,
  options: Omit<TextOptions, 'variant'> = {}
): ComponentInstance {
  return text(content, { ...options, variant: 'body' });
}
