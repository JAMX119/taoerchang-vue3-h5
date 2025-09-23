// 通用类型定义

// 基础响应结构
export interface BaseResponse<T = unknown> {
  success: boolean
  code: number
  message: string
  data: T
}
