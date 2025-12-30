/**
 * A2UI Primitive Types
 *
 * 基础值类型定义，支持字面值和数据绑定路径
 * These types represent values that can be either literal values or data bindings
 */

/**
 * 字符串值 - 可以是字面值或数据路径绑定
 * @example
 * // Literal value
 * { literalString: "Hello World" }
 * // or simply a string (v0.9 format)
 * "Hello World"
 *
 * // Data binding
 * { path: "/user/name" }
 */
export type StringOrPath = string | { path: string };

/**
 * 数值 - 可以是字面值或数据路径绑定
 */
export type NumberOrPath = number | { path: string };

/**
 * 布尔值 - 可以是字面值或数据路径绑定
 */
export type BooleanOrPath = boolean | { path: string };

/**
 * 字符串数组 - 可以是字面值或数据路径绑定
 */
export type StringArrayOrPath = string[] | { path: string };

/**
 * v0.8 格式的字符串值（带有 literalString/path 区分）
 */
export interface StringValue {
  path?: string;
  literalString?: string;
  /** @deprecated 使用 literalString */
  literal?: string;
}

/**
 * v0.8 格式的数值（带有 literalNumber/path 区分）
 */
export interface NumberValue {
  path?: string;
  literalNumber?: number;
  /** @deprecated 使用 literalNumber */
  literal?: number;
}

/**
 * v0.8 格式的布尔值（带有 literalBoolean/path 区分）
 */
export interface BooleanValue {
  path?: string;
  literalBoolean?: boolean;
  /** @deprecated 使用 literalBoolean */
  literal?: boolean;
}

/**
 * v0.8 格式的字符串数组值
 */
export interface StringArrayValue {
  path?: string;
  literalArray?: string[];
}

/**
 * Context value - 用于 Action context 中的值
 */
export type ContextValue = string | number | boolean | { path: string };
