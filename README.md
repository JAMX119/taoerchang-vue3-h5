# 陶二厂H5应用

## 项目简介
陶二厂H5应用是一个基于Vue 3开发的移动端H5页面，提供弹幕发送、大屏幕展示等功能，为用户提供互动体验。

## 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **CSS框架**: Tailwind CSS (weapp-tailwindcss适配)
- **路由**: Vue Router
- **UI组件**: Element Plus
- **测试工具**: Vitest, Playwright
- **代码规范**: ESLint, Prettier

## 功能特点

- **首页展示**: 项目入口页面，包含隐私协议确认
- **弹幕发送**: 用户可以发送自定义弹幕内容
- **大屏幕展示**: 实时展示所有用户发送的弹幕，背景为视频播放
- **微信授权**: 集成微信授权登录功能
- **响应式设计**: 适配不同尺寸的移动设备

## 项目结构

```
├── src/
│   ├── api/           # API接口定义
│   ├── assets/        # 静态资源（图片、字体、视频等）
│   ├── components/    # 公共组件
│   ├── router/        # 路由配置
│   ├── stores/        # Pinia状态管理
│   ├── types/         # TypeScript类型定义
│   ├── utils/         # 工具函数
│   ├── views/         # 页面组件
│   │   ├── Home/      # 首页
│   │   ├── Authorize/ # 授权页面
│   │   ├── SendBarrage/ # 发送弹幕页面
│   │   └── LargeScreen/ # 大屏幕展示页面
│   ├── App.vue        # 根组件
│   ├── main.ts        # 入口文件
│   └── style.css      # 全局样式
├── public/            # 公共静态资源
├── server/            # 后端服务示例
├── vite.config.ts     # Vite配置
└── package.json       # 项目配置和依赖
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 运行类型检查

```bash
npm run type-check
```

### 运行单元测试

```bash
npm run test:unit
```

### 运行端到端测试

```bash
# 首次运行需要安装浏览器
npx playwright install

# 运行测试
npm run test:e2e
```

### 代码风格检查

```bash
npm run lint
```

## 开发注意事项

### 字体配置
项目使用了思源黑体作为主要字体，已在`style.css`中配置。为了优化字体加载性能，使用了字体预加载和`font-display: swap`策略。

### 弹幕功能
弹幕功能主要由以下部分组成：
- `stores/barrage.ts`: 弹幕状态管理
- `views/LargeScreen/index.vue`: 弹幕展示组件
- `views/SendBarrage/`: 弹幕发送页面

### 微信授权
微信授权相关逻辑在`utils/wechat-auth.ts`中实现，授权页面位于`views/Authorize/`。

### 环境变量
项目使用Vite的环境变量配置，可根据不同环境创建`.env`、`.env.development`等文件。

## 部署说明

### 构建配置
生产环境构建时，base路径配置为`/bilibilih5/dist/`，请确保部署路径与此一致或修改`vite.config.ts`中的配置。

### 服务器部署
项目包含简单的Express服务器示例（位于`server/`目录），可用于生产环境部署。

1. 构建项目：
```bash
npm run build
```

2. 启动服务器：
```bash
cd server
npm install
npm start
```

## 许可证

本项目仅供内部使用。
