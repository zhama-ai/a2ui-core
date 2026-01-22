/**
 * A2UI Surface Module
 *
 * 提供 Surface 相关的常量和构建工具
 * 基于 v0.9 格式
 *
 * 参考：https://a2ui.org/
 */

export {
  SURFACE_IDS,
  type SurfaceIdType,
  type SurfaceConfig,
  generateSurfaceId,
  resetSurfaceIdCounter,
} from './surface-ids';

export {
  type SurfaceResult,
  type SurfaceOptions,
  createA2UISurface,
  createA2UISurfaceWithData,
  createDeleteSurfaceMessage,
  createChatSurface,
  createRecommendationSurface,
  createInputFormSurface,
  createOrchestrationSurface,
  createStatusSurface,
} from './surface-builder';
