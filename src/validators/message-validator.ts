/**
 * Message Validator
 *
 * 提供 A2UI 消息验证功能
 */

import type {
  ServerToClientMessage,
  ServerToClientMessageV08,
  ServerToClientMessageV09,
  ComponentInstance,
  ComponentInstanceV08,
} from '../types';

/**
 * 验证结果
 */
export interface ValidationResult {
  /** 是否有效 */
  valid: boolean;
  /** 错误信息列表 */
  errors: ValidationError[];
  /** 警告信息列表 */
  warnings: ValidationWarning[];
}

/**
 * 验证错误
 */
export interface ValidationError {
  /** 错误代码 */
  code: string;
  /** 错误消息 */
  message: string;
  /** 错误路径（如 'components[0].id'） */
  path?: string;
}

/**
 * 验证警告
 */
export interface ValidationWarning {
  /** 警告代码 */
  code: string;
  /** 警告消息 */
  message: string;
  /** 警告路径 */
  path?: string;
}

/**
 * 验证选项
 */
export interface ValidationOptions {
  /** 是否严格模式（报告更多问题） */
  strict?: boolean;
  /** 允许的组件类型（为空表示允许所有） */
  allowedComponents?: string[];
}

/**
 * 标准组件类型列表
 */
const STANDARD_COMPONENT_TYPES = [
  'Text',
  'Image',
  'Icon',
  'Video',
  'AudioPlayer',
  'Row',
  'Column',
  'List',
  'Card',
  'Tabs',
  'Divider',
  'Modal',
  'Button',
  'CheckBox',
  'TextField',
  'DateTimeInput',
  'ChoicePicker',
  'Slider',
];

/**
 * 验证 v0.9 消息
 */
export function validateV09Message(
  message: ServerToClientMessageV09,
  options: ValidationOptions = {}
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if ('createSurface' in message) {
    const { createSurface } = message;
    if (!createSurface.surfaceId) {
      errors.push({
        code: 'MISSING_SURFACE_ID',
        message: 'createSurface.surfaceId is required',
        path: 'createSurface.surfaceId',
      });
    }
    if (!createSurface.catalogId) {
      errors.push({
        code: 'MISSING_CATALOG_ID',
        message: 'createSurface.catalogId is required',
        path: 'createSurface.catalogId',
      });
    }
  } else if ('updateComponents' in message) {
    const { updateComponents } = message;
    if (!updateComponents.surfaceId) {
      errors.push({
        code: 'MISSING_SURFACE_ID',
        message: 'updateComponents.surfaceId is required',
        path: 'updateComponents.surfaceId',
      });
    }
    if (!updateComponents.components || !Array.isArray(updateComponents.components)) {
      errors.push({
        code: 'INVALID_COMPONENTS',
        message: 'updateComponents.components must be an array',
        path: 'updateComponents.components',
      });
    } else {
      // 验证组件
      validateComponentsV09(updateComponents.components, errors, warnings, options);
    }
  } else if ('updateDataModel' in message) {
    const { updateDataModel } = message;
    if (!updateDataModel.surfaceId) {
      errors.push({
        code: 'MISSING_SURFACE_ID',
        message: 'updateDataModel.surfaceId is required',
        path: 'updateDataModel.surfaceId',
      });
    }
  } else if ('deleteSurface' in message) {
    const { deleteSurface } = message;
    if (!deleteSurface.surfaceId) {
      errors.push({
        code: 'MISSING_SURFACE_ID',
        message: 'deleteSurface.surfaceId is required',
        path: 'deleteSurface.surfaceId',
      });
    }
  } else {
    errors.push({
      code: 'INVALID_MESSAGE_TYPE',
      message:
        'Message must contain one of: createSurface, updateComponents, updateDataModel, deleteSurface',
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 验证 v0.8 消息
 */
export function validateV08Message(
  message: ServerToClientMessageV08,
  options: ValidationOptions = {}
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if ('beginRendering' in message) {
    const { beginRendering } = message;
    if (!beginRendering.surfaceId) {
      errors.push({
        code: 'MISSING_SURFACE_ID',
        message: 'beginRendering.surfaceId is required',
        path: 'beginRendering.surfaceId',
      });
    }
    if (!beginRendering.root) {
      errors.push({
        code: 'MISSING_ROOT',
        message: 'beginRendering.root is required',
        path: 'beginRendering.root',
      });
    }
  } else if ('surfaceUpdate' in message) {
    const { surfaceUpdate } = message;
    if (!surfaceUpdate.surfaceId) {
      errors.push({
        code: 'MISSING_SURFACE_ID',
        message: 'surfaceUpdate.surfaceId is required',
        path: 'surfaceUpdate.surfaceId',
      });
    }
    if (!surfaceUpdate.components || !Array.isArray(surfaceUpdate.components)) {
      errors.push({
        code: 'INVALID_COMPONENTS',
        message: 'surfaceUpdate.components must be an array',
        path: 'surfaceUpdate.components',
      });
    } else {
      validateComponentsV08(surfaceUpdate.components, errors, warnings, options);
    }
  } else if ('dataModelUpdate' in message) {
    const { dataModelUpdate } = message;
    if (!dataModelUpdate.surfaceId) {
      errors.push({
        code: 'MISSING_SURFACE_ID',
        message: 'dataModelUpdate.surfaceId is required',
        path: 'dataModelUpdate.surfaceId',
      });
    }
    if (!dataModelUpdate.contents || !Array.isArray(dataModelUpdate.contents)) {
      errors.push({
        code: 'INVALID_CONTENTS',
        message: 'dataModelUpdate.contents must be an array',
        path: 'dataModelUpdate.contents',
      });
    }
  } else if ('deleteSurface' in message) {
    const { deleteSurface } = message;
    if (!deleteSurface.surfaceId) {
      errors.push({
        code: 'MISSING_SURFACE_ID',
        message: 'deleteSurface.surfaceId is required',
        path: 'deleteSurface.surfaceId',
      });
    }
  } else {
    errors.push({
      code: 'INVALID_MESSAGE_TYPE',
      message:
        'Message must contain one of: beginRendering, surfaceUpdate, dataModelUpdate, deleteSurface',
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 验证消息（自动检测版本）
 */
export function validateMessage(
  message: ServerToClientMessage,
  options: ValidationOptions = {}
): ValidationResult {
  // 检测消息版本
  if ('createSurface' in message || 'updateComponents' in message || 'updateDataModel' in message) {
    return validateV09Message(message as ServerToClientMessageV09, options);
  }

  if ('beginRendering' in message || 'surfaceUpdate' in message || 'dataModelUpdate' in message) {
    return validateV08Message(message as ServerToClientMessageV08, options);
  }

  if ('deleteSurface' in message) {
    // deleteSurface 在两个版本中格式相同
    if (!message.deleteSurface.surfaceId) {
      return {
        valid: false,
        errors: [
          {
            code: 'MISSING_SURFACE_ID',
            message: 'deleteSurface.surfaceId is required',
            path: 'deleteSurface.surfaceId',
          },
        ],
        warnings: [],
      };
    }
    return { valid: true, errors: [], warnings: [] };
  }

  return {
    valid: false,
    errors: [
      {
        code: 'UNKNOWN_MESSAGE_TYPE',
        message: 'Unknown message type',
      },
    ],
    warnings: [],
  };
}

/**
 * 验证消息数组
 */
export function validateMessages(
  messages: ServerToClientMessage[],
  options: ValidationOptions = {}
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    if (!message) continue;

    const result = validateMessage(message, options);
    for (const error of result.errors) {
      errors.push({
        ...error,
        path: `messages[${i}].${error.path ?? ''}`,
      });
    }
    for (const warning of result.warnings) {
      warnings.push({
        ...warning,
        path: `messages[${i}].${warning.path ?? ''}`,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// 内部辅助函数
// ============================================================================

function validateComponentsV09(
  components: ComponentInstance[],
  errors: ValidationError[],
  warnings: ValidationWarning[],
  options: ValidationOptions
): void {
  const componentIds = new Set<string>();
  let hasRoot = false;

  for (let i = 0; i < components.length; i++) {
    const comp = components[i];
    if (!comp) continue;

    const path = `updateComponents.components[${i}]`;

    // 验证 ID
    if (!comp.id) {
      errors.push({
        code: 'MISSING_COMPONENT_ID',
        message: 'Component id is required',
        path: `${path}.id`,
      });
    } else {
      if (componentIds.has(comp.id)) {
        errors.push({
          code: 'DUPLICATE_COMPONENT_ID',
          message: `Duplicate component id: ${comp.id}`,
          path: `${path}.id`,
        });
      }
      componentIds.add(comp.id);

      if (comp.id === 'root') {
        hasRoot = true;
      }
    }

    // 验证组件类型
    if (!comp.component) {
      errors.push({
        code: 'MISSING_COMPONENT_TYPE',
        message: 'Component type is required',
        path: `${path}.component`,
      });
    } else if (options.strict && options.allowedComponents) {
      if (!options.allowedComponents.includes(comp.component)) {
        warnings.push({
          code: 'UNKNOWN_COMPONENT_TYPE',
          message: `Unknown component type: ${comp.component}`,
          path: `${path}.component`,
        });
      }
    }
  }

  // 检查是否有 root 组件
  if (!hasRoot && options.strict) {
    warnings.push({
      code: 'MISSING_ROOT_COMPONENT',
      message: 'No component with id "root" found',
      path: 'updateComponents.components',
    });
  }
}

function validateComponentsV08(
  components: ComponentInstanceV08[],
  errors: ValidationError[],
  warnings: ValidationWarning[],
  options: ValidationOptions
): void {
  const componentIds = new Set<string>();

  for (let i = 0; i < components.length; i++) {
    const comp = components[i];
    if (!comp) continue;

    const path = `surfaceUpdate.components[${i}]`;

    // 验证 ID
    if (!comp.id) {
      errors.push({
        code: 'MISSING_COMPONENT_ID',
        message: 'Component id is required',
        path: `${path}.id`,
      });
    } else {
      if (componentIds.has(comp.id)) {
        errors.push({
          code: 'DUPLICATE_COMPONENT_ID',
          message: `Duplicate component id: ${comp.id}`,
          path: `${path}.id`,
        });
      }
      componentIds.add(comp.id);
    }

    // 验证组件类型
    if (!comp.component || typeof comp.component !== 'object') {
      errors.push({
        code: 'MISSING_COMPONENT',
        message: 'Component definition is required',
        path: `${path}.component`,
      });
    } else {
      const componentType = Object.keys(comp.component)[0];
      if (componentType && options.strict && !STANDARD_COMPONENT_TYPES.includes(componentType)) {
        warnings.push({
          code: 'UNKNOWN_COMPONENT_TYPE',
          message: `Unknown component type: ${componentType}`,
          path: `${path}.component`,
        });
      }
    }
  }
}
