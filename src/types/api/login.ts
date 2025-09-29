// 微信授权链接响应
export interface WechatAuthUrlResponse {
  authUrl: string
}

// 微信授权相关类型定义
export interface WechatUserInfoAll {
  city: string
  country: string
  headimgurl: string
  language: string
  nickname: string
  openid: string
  privilege: []
  province: string
  sex: number
}

// 微信用户信息
export interface WechatUserInfoResponse {
  open_id: string
  name: string
  nick_name: string
  avatar: string
  all: WechatUserInfoAll
}

export interface MemberTokenResponse {
  token: string
  membership_code: string
}

// 微信授权范围
export type WechatAuthScope = 'snsapi_base' | 'snsapi_userinfo'

export type GetWechatUserInfoParams = {
  code: string
  company_id: string
  scope: WechatAuthScope
}

export type PostToeknParams = {
  company_id: string
  dep_code: string
  id?: string | number
}

export type PostToeknData = {
  login_field: string
  login_value: string
  openid: string
  username?: string
  avatar?: string
  nick_name?: string
}
