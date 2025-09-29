import { get, post, paramsToQuery } from './request'
import type {
  WechatAuthUrlResponse,
  GetWechatUserInfoParams,
  WechatUserInfoResponse,
  PostToeknParams,
  PostToeknData,
  MemberTokenResponse,
} from '@/types'

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
 * member表用户获取注册获取token
 * @param params 请求参数，通常包含code
 * @returns Promise<ApiResponse<WechatUserInfo>>
 */
export const getWechatUserInfo = (params?: GetWechatUserInfoParams) => {
  return get<WechatUserInfoResponse>('/api/common/v2/company/wechat/user/info', params)
}

/**
 * 获取微信用户信息
 * @param data 请求参数，PostToeknData
 * @param params 请求参数，PostToeknParams
 * @returns Promise<ApiResponse<WechatUserInfo>>
 */
export const postMemberToken = (params: PostToeknParams, data: PostToeknData) => {
  return post<MemberTokenResponse>('/api/common/v2/member/login?' + paramsToQuery(params), data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
