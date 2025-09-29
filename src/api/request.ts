// 封装全面的axios请求
import axios from 'axios'
import type { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'
import type { RequestConfig, ApiResponse, CancelRequestMap } from '@/types'

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // 所有请求的基础URL
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
})

// 当前正在请求的数量
let requestCount = 0

// 显示加载状态
const showLoading = () => {
  // 这里可以实现自己的加载状态显示逻辑
  // 例如使用Element Plus的Loading组件
  if (requestCount === 0) {
    // ElLoading.service({
    //   lock: true,
    //   text: '加载中...',
    //   background: 'rgba(0, 0, 0, 0.7)'
    // })
  }
  requestCount++
}

// 隐藏加载状态
const hideLoading = () => {
  requestCount--
  if (requestCount === 0) {
    // ElLoading.service().close()
  }
}

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 1. 显示加载状态
    if ((config as RequestConfig).showLoading !== false) {
      showLoading()
    }

    // 2. 添加token等认证信息
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      // config.headers.Authorization = `Bearer ${token}`
      config.headers.token = token
    }

    // 3. 添加时间戳，防止缓存
    if (config.method?.toLowerCase() === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      }
    }

    return config
  },
  (error: AxiosError) => {
    hideLoading()
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    hideLoading()

    const res = response.data

    // 4. 统一处理响应数据
    if (+res.code === 200) {
      return res.data
    } else {
      // 5. 处理业务错误
      handleError(res.code, res.message)
      return Promise.reject(new Error(res.message || '请求失败'))
    }
  },
  (error: AxiosError<ApiResponse>) => {
    hideLoading()

    const config = error.config || ({} as InternalAxiosRequestConfig)
    const { response } = error

    // 6. 处理网络错误和重试逻辑
    if (error.code === 'ECONNABORTED' && error.message?.includes('timeout')) {
      // 请求超时
      console.error('请求超时，请稍后重试')
      // alert('请求超时，请稍后重试')
    } else if (response) {
      // 服务器返回错误状态码
      handleError(response.status, response.data?.message || '请求失败')
    } else if (!window.navigator.onLine) {
      // 离线状态
      console.error('网络连接已断开，请检查网络')
      // alert('网络连接已断开，请检查网络')
    } else {
      // 其他错误
      console.error('请求失败，请稍后重试')
      // alert('请求失败，请稍后重试')
    }

    // 7. 请求重试机制
    const requestConfig = config as RequestConfig
    if (requestConfig.retry) {
      const retryCount = requestConfig.retryCount || 0
      const retryDelay = requestConfig.retryDelay || 1000

      if (retryCount < 3) {
        requestConfig.retryCount = retryCount + 1

        return new Promise((resolve) => {
          setTimeout(() => {
            console.log(`请求重试 ${retryCount + 1} 次`)
            resolve(service(requestConfig))
          }, retryDelay)
        })
      }
    }

    return Promise.reject(error)
  },
)

// 错误处理函数
function handleError(code: number, message: string) {
  // 根据不同的错误码执行不同的操作
  switch (code) {
    case 401:
      // 未授权，跳转到登录页
      console.error('登录已过期，请重新登录')
      alert('登录已过期，请重新登录')
      localStorage.removeItem('token')
      setTimeout(() => {
        window.location.href = '/login'
      }, 1500)
      break
    case 403:
      // 拒绝访问
      console.error('没有权限访问该资源')
      alert('没有权限访问该资源')
      break
    case 404:
      // 资源不存在
      console.error('请求的资源不存在')
      alert('请求的资源不存在')
      break
    case 500:
      // 服务器错误
      console.error('服务器内部错误，请稍后重试')
      alert('服务器内部错误，请稍后重试')
      break
    default:
      // 其他错误
      console.error(message || '请求失败')
      alert(message || '请求失败')
  }
}

// 8. 取消请求的工具函数
const cancelTokenSources: CancelRequestMap = new Map()

/**
 * 生成取消请求的token
 * @param key 请求的唯一标识
 * @returns 包含cancelToken的配置对象
 */
export function generateCancelToken(key: string) {
  const source = axios.CancelToken.source()
  cancelTokenSources.set(key, source)
  return {
    cancelToken: source.token,
  }
}

/**
 * 取消指定的请求
 * @param key 请求的唯一标识
 */
export function cancelRequest(key: string) {
  if (cancelTokenSources.has(key)) {
    cancelTokenSources.get(key)?.cancel('请求已取消')
    cancelTokenSources.delete(key)
  }
}

/**
 * 取消所有请求
 */
export function cancelAllRequests() {
  for (const source of cancelTokenSources.values()) {
    source.cancel('所有请求已取消')
  }
  cancelTokenSources.clear()
}

/**
 * GET请求
 * @param url 请求URL
 * @param params 请求参数
 * @param config 请求配置
 * @returns Promise<T>
 */
export function get<T = unknown>(
  url: string,
  params?: Record<string, unknown>,
  config?: RequestConfig,
): Promise<T> {
  return service.get(url, {
    params,
    ...config,
  })
}

/**
 * POST请求
 * @param url 请求URL
 * @param data 请求数据
 * @param config 请求配置
 * @returns Promise<T>
 */
export function post<T = unknown>(
  url: string,
  data?: Record<string, unknown>,
  config?: RequestConfig,
): Promise<T> {
  return service.post(url, data, config)
}

/**
 * PUT请求
 * @param url 请求URL
 * @param data 请求数据
 * @param config 请求配置
 * @returns Promise<T>
 */
export function put<T = unknown>(
  url: string,
  data?: Record<string, unknown>,
  config?: RequestConfig,
): Promise<T> {
  return service.put(url, data, config)
}

/**
 * DELETE请求
 * @param url 请求URL
 * @param params 请求参数
 * @param config 请求配置
 * @returns Promise<T>
 */
export function del<T = unknown>(
  url: string,
  params?: Record<string, unknown>,
  config?: RequestConfig,
): Promise<T> {
  return service.delete(url, {
    params,
    ...config,
  })
}

/**
 * PATCH请求
 * @param url 请求URL
 * @param data 请求数据
 * @param config 请求配置
 * @returns Promise<T>
 */
export function patch<T = unknown>(
  url: string,
  data?: Record<string, unknown>,
  config?: RequestConfig,
): Promise<T> {
  return service.patch(url, data, config)
}

/**
 * 将参数对象转换为查询字符串
 * @param params 参数对象
 * @returns 查询字符串
 */
export function paramsToQuery(params: Record<string, unknown>) {
  return new URLSearchParams(
    Object.entries(params).map(([key, value]) => [key, String(value)]),
  ).toString()
}
// 导出默认的axios实例和请求方法
export default service
