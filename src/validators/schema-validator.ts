/**
 * Schema Validator
 *
 * 基于官方 A2UI v0.9 JSON Schema 的验证器
 */

import Ajv2020, { type ErrorObject } from 'ajv/dist/2020';
import addFormats from 'ajv-formats';

// Import v0.9 schemas
import clientToServerSchema from '../schemas/0.9/client_to_server.json';
import commonTypesSchema from '../schemas/0.9/common_types.json';
import serverToClientSchema from '../schemas/0.9/server_to_client.json';
import standardCatalogSchema from '../schemas/0.9/standard_catalog_definition.json';

/**
 * Schema 验证结果
 */
export interface SchemaValidationResult {
  /** 是否有效 */
  valid: boolean;
  /** 验证错误列表 */
  errors: SchemaValidationError[];
}

/**
 * Schema 验证错误
 */
export interface SchemaValidationError {
  /** JSON Pointer 路径 */
  path: string;
  /** 错误消息 */
  message: string;
  /** 错误关键字 */
  keyword: string;
  /** 期望的值/类型 */
  expected?: unknown;
  /** 实际的值 */
  actual?: unknown;
}

/**
 * A2UI Schema 验证器类
 */
export class A2UISchemaValidator {
  private ajv: Ajv2020;
  private serverToClientValidator: ReturnType<Ajv2020['compile']>;
  private clientToServerValidator: ReturnType<Ajv2020['compile']>;

  constructor() {
    this.ajv = new Ajv2020({
      allErrors: true,
      strict: false,
    });

    // 添加格式支持 (date-time 等)
    addFormats(this.ajv);

    // 添加所有 schema
    this.ajv.addSchema(commonTypesSchema, 'common_types.json');
    this.ajv.addSchema(standardCatalogSchema, 'standard_catalog_definition.json');

    // 编译主 schema
    this.serverToClientValidator = this.ajv.compile(serverToClientSchema);
    this.clientToServerValidator = this.ajv.compile(clientToServerSchema);
  }

  /**
   * 验证服务器到客户端消息
   */
  validateServerToClientMessage(message: unknown): SchemaValidationResult {
    const valid = this.serverToClientValidator(message);

    if (valid) {
      return { valid: true, errors: [] };
    }

    return {
      valid: false,
      errors: this.formatErrors(this.serverToClientValidator.errors || []),
    };
  }

  /**
   * 验证客户端到服务器消息
   */
  validateClientToServerMessage(message: unknown): SchemaValidationResult {
    const valid = this.clientToServerValidator(message);

    if (valid) {
      return { valid: true, errors: [] };
    }

    return {
      valid: false,
      errors: this.formatErrors(this.clientToServerValidator.errors || []),
    };
  }

  /**
   * 验证消息数组
   */
  validateMessages(messages: unknown[]): SchemaValidationResult {
    const errors: SchemaValidationError[] = [];

    for (let i = 0; i < messages.length; i++) {
      const result = this.validateServerToClientMessage(messages[i]);
      if (!result.valid) {
        errors.push(
          ...result.errors.map((err) => ({
            ...err,
            path: `/messages/${i}${err.path}`,
          }))
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * 格式化 AJV 错误
   */
  private formatErrors(errors: ErrorObject[]): SchemaValidationError[] {
    return errors.map((error) => ({
      path: error.instancePath || '/',
      message: error.message || 'Validation failed',
      keyword: error.keyword,
      expected: error.params,
      actual: undefined,
    }));
  }
}

// 默认验证器实例
let defaultValidator: A2UISchemaValidator | null = null;

/**
 * 获取默认验证器实例
 */
export function getSchemaValidator(): A2UISchemaValidator {
  if (!defaultValidator) {
    defaultValidator = new A2UISchemaValidator();
  }
  return defaultValidator;
}

/**
 * 验证服务器到客户端消息（使用官方 JSON Schema）
 */
export function validateWithSchema(message: unknown): SchemaValidationResult {
  return getSchemaValidator().validateServerToClientMessage(message);
}

/**
 * 验证客户端到服务器消息（使用官方 JSON Schema）
 */
export function validateClientMessage(message: unknown): SchemaValidationResult {
  return getSchemaValidator().validateClientToServerMessage(message);
}

/**
 * 验证消息数组（使用官方 JSON Schema）
 */
export function validateMessagesWithSchema(messages: unknown[]): SchemaValidationResult {
  return getSchemaValidator().validateMessages(messages);
}
