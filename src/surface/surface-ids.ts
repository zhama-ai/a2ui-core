/**
 * Surface IDs and Configuration
 *
 * 预定义的 Surface ID 常量和配置
 * 前端根据这些 ID 决定渲染位置和样式
 */

/**
 * 标准 Surface ID 常量
 *
 * 前端可以根据这些 ID 决定：
 * - 渲染位置（聊天区、侧边栏、模态框等）
 * - 渲染样式（卡片、全屏、浮动等）
 * - 交互行为（自动消失、持久化等）
 *
 * @example
 * ```typescript
 * import { SURFACE_IDS, createA2UISurface } from '@zhama/a2ui-core';
 *
 * const surface = createA2UISurface('root', components, SURFACE_IDS.CHAT);
 * ```
 */
export const SURFACE_IDS = {
  /** 聊天内容区 - 普通对话消息 */
  CHAT: '@chat',
  /** 智能体推荐区 - 展示推荐的智能体列表 */
  RECOMMENDATION: '@recommendation',
  /** 输入收集表单 - 收集用户输入 */
  INPUT_FORM: '@input-form',
  /** 编排面板 - 多智能体编排状态 */
  ORCHESTRATION: '@orchestration',
  /** 临时状态提示 - loading/thinking/error 等 */
  STATUS: '@status',
  /** 结果展示区 - 智能体执行结果 */
  RESULT: '@result',
  /** 确认对话框 - 需要用户确认的操作 */
  CONFIRM: '@confirm',
  /** 通知区 - 系统通知 */
  NOTIFICATION: '@notification',
} as const;

/**
 * Surface ID 类型
 */
export type SurfaceIdType = (typeof SURFACE_IDS)[keyof typeof SURFACE_IDS];

/**
 * Surface 配置
 */
export interface SurfaceConfig {
  /** Surface ID */
  id: SurfaceIdType | string;
  /** 是否自动消失 */
  autoHide?: boolean;
  /** 自动消失延迟（毫秒） */
  autoHideDelay?: number;
  /** 是否可关闭 */
  closable?: boolean;
  /** 优先级（数字越大越优先显示） */
  priority?: number;
}

/**
 * Surface ID 计数器（用于生成唯一 ID）
 */
let surfaceIdCounter = 0;

/**
 * 生成唯一的 Surface ID
 *
 * @param prefix - ID 前缀
 * @returns 唯一的 Surface ID
 *
 * @example
 * ```typescript
 * const id = generateSurfaceId('status'); // 'status-1703123456789-1'
 * ```
 */
export function generateSurfaceId(prefix = 'surface'): string {
  surfaceIdCounter++;
  return `${prefix}-${Date.now()}-${surfaceIdCounter}`;
}

/**
 * 重置 Surface ID 计数器
 * 主要用于测试
 */
export function resetSurfaceIdCounter(): void {
  surfaceIdCounter = 0;
}
