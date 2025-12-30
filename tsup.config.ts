import { defineConfig } from 'tsup';

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = !isDevelopment;

export default defineConfig({
  // 多入口点
  entry: {
    index: 'src/index.ts',
    'types/index': 'src/types/index.ts',
    'builders/index': 'src/builders/index.ts',
    'validators/index': 'src/validators/index.ts',
    'utils/index': 'src/utils/index.ts',
    'surface/index': 'src/surface/index.ts',
  },

  // 输出格式：CJS + ESM 双格式
  format: ['cjs', 'esm'],

  // 目标环境：ES2020
  target: 'es2020',

  // 生成类型定义
  dts: {
    resolve: true, // 自动解析类型依赖
  },

  // 代码分割：库包不需要
  splitting: false,

  // 源码映射策略
  sourcemap: !isProduction || process.env.ENABLE_SOURCEMAP === 'true',

  // 压缩策略：始终启用压缩（发布库需要）
  minify: true,

  // 清理输出目录
  clean: true,

  // Tree-shaking
  treeshake: true,

  // 输出目录
  outDir: 'dist',

  // 构建完成回调
  onSuccess: 'echo "✅ @zhama/a2ui-core build completed"',
});
