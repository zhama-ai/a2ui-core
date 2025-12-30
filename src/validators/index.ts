/**
 * A2UI Validators Module
 *
 * 提供 A2UI 消息和组件的验证功能
 */

export {
  // 类型
  type ValidationResult,
  type ValidationError,
  type ValidationWarning,
  type ValidationOptions,
  // 验证函数
  validateV09Message,
  validateV08Message,
  validateMessage,
  validateMessages,
} from './message-validator';
