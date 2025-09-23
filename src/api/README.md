# Axios请求封装说明

本文档详细介绍了项目中axios请求的封装设计、功能特性和使用方法。

## 功能特性

- **基础配置**：预设baseURL、timeout、请求头等基础配置
- **请求拦截器**：自动添加token认证、时间戳防缓存、加载状态显示
- **响应拦截器**：统一处理响应数据、错误处理
- **错误处理**：根据HTTP状态码提供不同的错误提示和处理逻辑
- **重试机制**：支持失败自动重试功能
- **取消请求**：支持单条或全部请求的取消
- **类型安全**：完整的TypeScript类型定义
- **加载状态**：统一的加载状态管理

## 核心文件结构

```
src/
  ├── api/
  │   ├── request.ts  # axios核心封装
  │   ├── user.ts     # 示例API服务
  │   └── README.md   # 本说明文档
```

## request.ts 核心功能说明

### 1. 类型定义

- `RequestConfig`：扩展了axios请求配置，添加了自定义选项
- `ApiResponse`：统一的响应数据格式接口

### 2. 请求方法

封装了常用的HTTP请求方法：

- `get<T>(url, params?, config?)`：GET请求
- `post<T>(url, data?, config?)`：POST请求  
- `put<T>(url, data?, config?)`：PUT请求
- `del<T>(url, params?, config?)`：DELETE请求
- `patch<T>(url, data?, config?)`：PATCH请求

### 3. 取消请求工具

- `generateCancelToken(key)`：生成取消请求的token
- `cancelRequest(key)`：取消指定的请求
- `cancelAllRequests()`：取消所有请求

## 使用示例

### 1. 基础使用

```typescript
import { get, post } from './request'

// GET请求示例
async function fetchData() {
  try {
    const result = await get('/api/data', { id: 1 })
    console.log('请求成功:', result)
  } catch (error) {
    console.error('请求失败:', error)
  }
}

// POST请求示例
async function submitData() {
  try {
    const result = await post('/api/submit', { name: 'test' })
    console.log('提交成功:', result)
  } catch (error) {
    console.error('提交失败:', error)
  }
}
```

### 2. 配置选项

```typescript
// 自定义配置示例
await get('/api/data', { id: 1 }, {
  showLoading: true, // 显示加载状态
  showError: true,   // 显示错误提示
  retry: true,       // 开启重试机制
  retryDelay: 2000,  // 重试间隔2秒
  timeout: 30000     // 超时时间30秒
})
```

### 3. 取消请求

```typescript
import { get, generateCancelToken, cancelRequest } from './request'

// 生成取消token
const requestKey = 'fetchData'

// 发送请求时绑定取消token
const promise = get('/api/data', { id: 1 }, {
  ...generateCancelToken(requestKey)
})

// 在需要时取消请求
// 例如：组件卸载时、用户点击取消按钮时
cancelRequest(requestKey)

// 或者取消所有请求
// cancelAllRequests()
```

### 4. API服务封装示例

推荐将API按模块封装，如 `user.ts` 所示：

```typescript
// 用户API模块示例
import { get, post } from './request'

// 接口定义
export interface UserInfo {
  id: number
  username: string
  // 其他字段...
}

// 获取用户信息
export const getUserInfo = () => {
  return get<UserInfo>('/user/info', undefined, {
    showLoading: true,
    showError: true
  })
}

// 登录
export const login = (data: { username: string; password: string }) => {
  return post('/user/login', data, {
    showLoading: true,
    showError: true
  })
}
```

## 错误处理

请求失败时，系统会自动根据错误类型和状态码显示相应的错误提示。常见的错误处理包括：

- **401未授权**：自动清除token并跳转到登录页
- **403拒绝访问**：提示用户没有权限
- **404资源不存在**：提示请求的资源不存在
- **500服务器错误**：提示服务器内部错误
- **网络错误**：提示网络连接问题
- **请求超时**：提示请求超时

## 注意事项

1. 所有API请求默认会添加token认证信息，token存储在localStorage中
2. GET请求默认会添加时间戳参数，防止浏览器缓存
3. 默认的错误提示使用原生alert和console.error，可以根据项目需求替换为自定义的提示组件
4. 对于不需要显示加载状态的请求，可以设置`showLoading: false`
5. 对于不需要自动显示错误提示的请求，可以设置`showError: false`