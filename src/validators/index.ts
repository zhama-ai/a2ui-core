/**
 * A2UI Validators Module - v0.9
 *
 * 提供 A2UI v0.9 消息和组件的验证功能
 */

export {
  // 类型
  type ValidationResult,
  type ValidationError,
  type ValidationWarning,
  type ValidationOptions,
  // 验证函数 (v0.9)
  validateV09Message,
  validateMessage,
  validateMessages,
} from './message-validator';

export {
  // Schema 验证器类
  A2UISchemaValidator,
  // Schema 验证类型
  type SchemaValidationResult,
  type SchemaValidationError,
  // 便捷函数
  getSchemaValidator,
  validateWithSchema,
  validateClientMessage,
  validateMessagesWithSchema,
} from './schema-validator';
