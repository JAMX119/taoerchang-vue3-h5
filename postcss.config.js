/** @type {import('postcss').Config} */
export default {
  plugins: {
    // 使用简化配置，避免生成CSS变量
    '@tailwindcss/postcss': {},
    autoprefixer: { grid: true },
    'postcss-preset-env': {
      features: { 'nesting-rules': true },
      browsers: '> 0.5%, last 2 versions, not dead',
    },
  },
}
