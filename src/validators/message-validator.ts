/**
 * Message Validator - v0.9
 *
 * A2UI v0.9 消息验证
 */

import type { ServerToClientMessage, ComponentInstance } from '../types';

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  code: string;
  message: string;
  path?: string;
}

export interface ValidationWarning {
  code: string;
  message: string;
  path?: string;
}

export interface ValidationOptions {
  strict?: boolean;
  allowedComponents?: string[];
}

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

export function validateMessage(
  message: ServerToClientMessage,
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
    if (createSurface.theme?.primaryColor) {
      const colorPattern = /^#[0-9a-fA-F]{6}$/;
      if (!colorPattern.test(createSurface.theme.primaryColor)) {
        warnings.push({
          code: 'INVALID_PRIMARY_COLOR',
          message: 'primaryColor should be a hex color code (e.g., #00BFFF)',
          path: 'createSurface.theme.primaryColor',
        });
      }
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
      validateComponents(updateComponents.components, errors, warnings, options);
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

  return { valid: errors.length === 0, errors, warnings };
}

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
      errors.push({ ...error, path: `messages[${i}].${error.path ?? ''}` });
    }
    for (const warning of result.warnings) {
      warnings.push({ ...warning, path: `messages[${i}].${warning.path ?? ''}` });
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

function validateComponents(
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
      if (comp.id === 'root') hasRoot = true;
    }

    if (!comp.component) {
      errors.push({
        code: 'MISSING_COMPONENT_TYPE',
        message: 'Component type is required',
        path: `${path}.component`,
      });
    } else {
      if (options.strict && !STANDARD_COMPONENT_TYPES.includes(comp.component)) {
        if (!options.allowedComponents?.includes(comp.component)) {
          warnings.push({
            code: 'UNKNOWN_COMPONENT_TYPE',
            message: `Unknown component type: ${comp.component}`,
            path: `${path}.component`,
          });
        }
      }

      validateComponentProperties(comp, path, errors);
    }
  }

  if (!hasRoot && options.strict) {
    warnings.push({
      code: 'MISSING_ROOT_COMPONENT',
      message: 'No component with id "root" found',
      path: 'updateComponents.components',
    });
  }
}

function validateComponentProperties(
  comp: ComponentInstance,
  path: string,
  errors: ValidationError[]
): void {
  switch (comp.component) {
    case 'Text':
      if (comp.text === undefined) {
        errors.push({
          code: 'MISSING_REQUIRED_PROPERTY',
          message: 'Text component requires "text" property',
          path: `${path}.text`,
        });
      }
      break;
    case 'Image':
    case 'Video':
    case 'AudioPlayer':
      if (comp.url === undefined) {
        errors.push({
          code: 'MISSING_REQUIRED_PROPERTY',
          message: `${comp.component} component requires "url" property`,
          path: `${path}.url`,
        });
      }
      break;
    case 'Icon':
      if (comp.name === undefined) {
        errors.push({
          code: 'MISSING_REQUIRED_PROPERTY',
          message: 'Icon component requires "name" property',
          path: `${path}.name`,
        });
      }
      break;
    case 'Row':
    case 'Column':
    case 'List':
      if (comp.children === undefined) {
        errors.push({
          code: 'MISSING_REQUIRED_PROPERTY',
          message: `${comp.component} component requires "children" property`,
          path: `${path}.children`,
        });
      }
      break;
    case 'Card':
      if (comp.child === undefined) {
        errors.push({
          code: 'MISSING_REQUIRED_PROPERTY',
          message: 'Card component requires "child" property',
          path: `${path}.child`,
        });
      }
      break;
    case 'Tabs':
      if (comp.tabs === undefined) {
        errors.push({
          code: 'MISSING_REQUIRED_PROPERTY',
          message: 'Tabs component requires "tabs" property',
          path: `${path}.tabs`,
        });
      }
      break;
    case 'Modal':
      if (comp.trigger === undefined) {
        errors.push({
          code: 'MISSING_REQUIRED_PROPERTY',
          message: 'Modal component requires "trigger" property',
          path: `${path}.trigger`,
        });
      }
      if (comp.content === undefined) {
        errors.push({
          code: 'MISSING_REQUIRED_PROPERTY',
          message: 'Modal component requires "content" property',
          path: `${path}.content`,
        });
      }
      break;
    case 'Button':
      if (comp.child === undefined) {
        errors.push({
          code: 'MISSING_REQUIRED_PROPERTY',
          message: 'Button component requires "child" property',
          path: `${path}.child`,
        });
      }
      if (comp.action === undefined) {
        errors.push({
          code: 'MISSING_REQUIRED_PROPERTY',
          message: 'Button component requires "action" property',
          path: `${path}.action`,
        });
      }
      break;
    case 'CheckBox':
      if (comp.label === undefined) {
        errors.push({
          code: 'MISSING_REQUIRED_PROPERTY',
          message: 'CheckBox component requires "label" property',
          path: `${path}.label`,
        });
      }
      if (comp.value === undefined) {
        errors.push({
          code: 'MISSING_REQUIRED_PROPERTY',
          message: 'CheckBox component requires "value" property',
          path: `${path}.value`,
        });
      }
      break;
    case 'TextField':
      if (comp.label === undefined) {
        errors.push({
          code: 'MISSING_REQUIRED_PROPERTY',
          message: 'TextField component requires "label" property',
          path: `${path}.label`,
        });
      }
      break;
    case 'DateTimeInput':
      if (comp.value === undefined) {
        errors.push({
          code: 'MISSING_REQUIRED_PROPERTY',
          message: 'DateTimeInput component requires "value" property',
          path: `${path}.value`,
        });
      }
      break;
    case 'ChoicePicker':
      if (comp.options === undefined) {
        errors.push({
          code: 'MISSING_REQUIRED_PROPERTY',
          message: 'ChoicePicker component requires "options" property',
          path: `${path}.options`,
        });
      }
      if (comp.value === undefined) {
        errors.push({
          code: 'MISSING_REQUIRED_PROPERTY',
          message: 'ChoicePicker component requires "value" property',
          path: `${path}.value`,
        });
      }
      break;
    case 'Slider':
      if (comp.value === undefined) {
        errors.push({
          code: 'MISSING_REQUIRED_PROPERTY',
          message: 'Slider component requires "value" property',
          path: `${path}.value`,
        });
      }
      if (comp.min === undefined) {
        errors.push({
          code: 'MISSING_REQUIRED_PROPERTY',
          message: 'Slider component requires "min" property',
          path: `${path}.min`,
        });
      }
      if (comp.max === undefined) {
        errors.push({
          code: 'MISSING_REQUIRED_PROPERTY',
          message: 'Slider component requires "max" property',
          path: `${path}.max`,
        });
      }
      break;
  }
}
