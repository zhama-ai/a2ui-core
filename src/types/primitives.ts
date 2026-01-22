/**
 * A2UI Primitive Types
 *
 * 基础值类型定义，严格按照 A2UI v0.9 官方规范
 * @see https://a2ui.dev/specification/v0_9/common_types.json
 */

// ============================================================================
// DataBinding
// ============================================================================

/**
 * 数据绑定
 * @see common_types.json#/$defs/DataBinding
 */
export interface DataBinding {
  /**
   * JSON Pointer 路径
   * @example "/user/name"
   */
  path: string;
}

// ============================================================================
// FunctionCall
// ============================================================================

/**
 * 客户端函数调用
 * @see common_types.json#/$defs/FunctionCall
 */
export interface FunctionCall {
  /**
   * 要调用的函数名称
   */
  call: string;
  /**
   * 传递给函数的参数
   */
  args?: (DynamicValue | Record<string, unknown>)[];
  /**
   * 函数调用的预期返回类型
   * @default "boolean"
   */
  returnType?: FunctionReturnType;
}

/**
 * 函数调用返回类型
 */
export type FunctionReturnType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'array'
  | 'object'
  | 'any'
  | 'void';

// ============================================================================
// LogicExpression
// ============================================================================

/**
 * 逻辑表达式（用于条件状态如 enabled）
 * @see common_types.json#/$defs/LogicExpression
 */
export type LogicExpression =
  | { and: LogicExpression[] }
  | { or: LogicExpression[] }
  | { not: LogicExpression }
  | (FunctionCall & { returnType?: 'boolean' })
  | { true: true }
  | { false: false };

// ============================================================================
// Dynamic Types
// ============================================================================

/**
 * 动态字符串值
 * @see common_types.json#/$defs/DynamicString
 */
export type DynamicString = string | DataBinding | (FunctionCall & { returnType: 'string' });

/**
 * 动态数字值
 * @see common_types.json#/$defs/DynamicNumber
 */
export type DynamicNumber = number | DataBinding | (FunctionCall & { returnType: 'number' });

/**
 * 动态布尔值
 * @see common_types.json#/$defs/DynamicBoolean
 */
export type DynamicBoolean = boolean | DataBinding | LogicExpression;

/**
 * 动态字符串列表
 * @see common_types.json#/$defs/DynamicStringList
 */
export type DynamicStringList = string[] | DataBinding | (FunctionCall & { returnType: 'array' });

/**
 * 任意动态值
 * @see common_types.json#/$defs/DynamicValue
 */
export type DynamicValue = string | number | boolean | DataBinding | FunctionCall;

// ============================================================================
// CheckRule & Checkable
// ============================================================================

/**
 * 验证规则
 * @see common_types.json#/$defs/CheckRule
 */
export type CheckRule = LogicExpression & {
  /**
   * 验证失败时显示的错误消息
   */
  message: string;
};

/**
 * 可验证组件属性
 * @see common_types.json#/$defs/Checkable
 */
export interface Checkable {
  /**
   * 验证规则列表
   */
  checks?: CheckRule[];
}

// ============================================================================
// AccessibilityAttributes
// ============================================================================

/**
 * 无障碍属性
 * @see common_types.json#/$defs/AccessibilityAttributes
 */
export interface AccessibilityAttributes {
  /**
   * 覆盖内容描述
   */
  label?: DynamicString;
  /**
   * 描述执行操作的结果
   */
  description?: DynamicString;
  /**
   * 显式设置元素的语义角色
   */
  role?: AccessibilityRole;
  /**
   * 如果为 true，元素及其子元素对无障碍服务隐藏
   */
  hidden?: DynamicBoolean;
  /**
   * 指示此元素的更新应自动宣布
   */
  liveRegion?: LiveRegion;
}

/**
 * 无障碍角色类型
 */
export type AccessibilityRole =
  | 'button'
  | 'header'
  | 'link'
  | 'image'
  | 'adjustable'
  | 'summary'
  | 'none';

/**
 * 实时区域类型
 */
export type LiveRegion = 'polite' | 'assertive' | 'off';

// ============================================================================
// ContextValue (用于 Action context)
// ============================================================================

/**
 * Action 上下文值类型
 */
export type ContextValue = DynamicValue;
