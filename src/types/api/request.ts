// 请求相关类型定义

import type { AxiosRequestConfig, CancelTokenSource } from 'axios'
import type { BaseResponse } from '../common'

// 请求配置扩展
export interface RequestConfig extends Omit<AxiosRequestConfig, 'cancelToken'> {
  // 是否显示加载状态
  showLoading?: boolean
  // 是否显示错误提示
  showError?: boolean
  // 是否需要重试
  retry?: boolean
  // 重试次数
  retryCount?: number
  // 重试间隔(ms)
  retryDelay?: number
  // 请求的唯一标识，用于取消请求
  requestKey?: string
}

// API响应
export type ApiResponse<T = unknown> = BaseResponse<T>

// 取消请求相关类型
export type CancelRequestMap = Map<string, CancelTokenSource>
