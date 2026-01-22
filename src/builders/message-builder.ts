/**
 * Message Builder
 *
 * A2UI v0.9 消息构建器
 */

import type {
  CreateSurfaceMessage,
  UpdateComponentsMessage,
  UpdateDataModelMessage,
  DeleteSurfaceMessage,
  ServerToClientMessage,
  ComponentInstance,
  DataObject,
  Theme,
} from '../types';
import { STANDARD_CATALOG_ID } from '../types';

// ============================================================================
// Options
// ============================================================================

export interface CreateSurfaceOptions {
  catalogId?: string;
  theme?: Theme;
  sendDataModel?: boolean;
}

// ============================================================================
// Message Builders
// ============================================================================

export function createSurface(
  surfaceId: string,
  options: CreateSurfaceOptions = {}
): CreateSurfaceMessage {
  const { catalogId = STANDARD_CATALOG_ID, theme, sendDataModel } = options;
  return {
    createSurface: {
      surfaceId,
      catalogId,
      ...(theme && { theme }),
      ...(sendDataModel !== undefined && { sendDataModel }),
    },
  };
}

export function updateComponents(
  surfaceId: string,
  components: ComponentInstance[]
): UpdateComponentsMessage {
  return {
    updateComponents: {
      surfaceId,
      components,
    },
  };
}

export function updateDataModel(
  surfaceId: string,
  value?: unknown,
  path?: string
): UpdateDataModelMessage {
  return {
    updateDataModel: {
      surfaceId,
      ...(path && { path }),
      ...(value !== undefined && { value }),
    },
  };
}

export function deleteSurface(surfaceId: string): DeleteSurfaceMessage {
  return {
    deleteSurface: {
      surfaceId,
    },
  };
}

export function createMessages(options: {
  surfaceId: string;
  catalogId?: string;
  theme?: Theme;
  sendDataModel?: boolean;
  components: ComponentInstance[];
  dataModel?: DataObject;
}): ServerToClientMessage[] {
  const { surfaceId, catalogId, theme, sendDataModel, components, dataModel } = options;

  const messages: ServerToClientMessage[] = [
    createSurface(surfaceId, { catalogId, theme, sendDataModel }),
    updateComponents(surfaceId, components),
  ];

  if (dataModel) {
    messages.push(updateDataModel(surfaceId, dataModel));
  }

  return messages;
}

// ============================================================================
// Utilities
// ============================================================================

export function messagesToJsonl(messages: ServerToClientMessage[]): string {
  return messages.map((msg) => JSON.stringify(msg)).join('\n');
}

export function jsonlToMessages(jsonl: string): ServerToClientMessage[] {
  return jsonl
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line) as ServerToClientMessage);
}
