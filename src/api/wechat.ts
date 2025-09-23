import { get } from './request'
import type { WechatAuthUrlResponse, WechatUserInfo } from '@/types'

/**
 * 获取微信授权链接
 * @param params 授权链接参数
 * @returns Promise<ApiResponse<{ authUrl: string }>>
 */
export const getWechatAuthUrl = (params?: { redirectUri: string }) => {
  return get<WechatAuthUrlResponse>('/api/wechat/auth-url', params, {
    showLoading: true,
    showError: true,
  })
}

/**
 * 获取微信用户信息
 * @param params 请求参数，通常包含code
 * @returns Promise<ApiResponse<WechatUserInfo>>
 */
export const getWechatUserInfo = (params?: { code: string }) => {
  return get<WechatUserInfo>('/api/wechat/userinfo', params, {
    showLoading: true,
    showError: true,
  })
}
