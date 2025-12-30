/**
 * ID Generator
 *
 * 生成唯一的组件 ID
 */

let componentIdCounter = 0;

/**
 * 生成唯一的组件 ID
 *
 * @param prefix - ID 前缀
 * @returns 唯一的组件 ID
 *
 * @example
 * generateId('text'); // 'text_1703123456789_0'
 * generateId('btn');  // 'btn_1703123456789_1'
 */
export function generateId(prefix = 'comp'): string {
  return `${prefix}_${Date.now()}_${componentIdCounter++}`;
}

/**
 * 重置 ID 计数器
 * 在渲染新场景时调用，确保 ID 从 0 开始
 */
export function resetIdCounter(): void {
  componentIdCounter = 0;
}

/**
 * 获取当前计数器值（用于测试）
 */
export function getIdCounter(): number {
  return componentIdCounter;
}
