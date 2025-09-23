// 微信授权相关类型定义

// 微信用户信息
export interface WechatUserInfo {
  openId: string
  nickname: string
  avatarUrl: string
  gender: number
  province: string
  city: string
  country: string
}

// 微信授权范围
export type WechatAuthScope = 'snsapi_base' | 'snsapi_userinfo'

// 微信授权链接响应
export interface WechatAuthUrlResponse {
  authUrl: string
}

// 微信授权流程结果
export interface WechatAuthResult {
  success: boolean
  userInfo?: WechatUserInfo
  error?: string
}
