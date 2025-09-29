// 微信授权相关工具函数
import type { WechatAuthScope } from '@/types'

// 微信APPID（实际项目中应从环境变量获取）
export const WX_APPID = import.meta.env.VITE_WX_APPID || ''

// 构建微信授权链接
export function buildWechatAuthUrl(
  redirectUri: string,
  scope: WechatAuthScope = 'snsapi_userinfo',
): string {
  const encodedRedirectUri = encodeURIComponent(redirectUri)
  const state = 'STATE' // 可根据需要自定义state参数
  return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${WX_APPID}&redirect_uri=${encodedRedirectUri}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`
}

// 从URL中获取授权code
export function getCodeFromUrl(): string | null {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('code')
}

// 移除URL中的code参数（避免重复授权）
export function removeCodeFromUrl(): void {
  const url = new URL(window.location.href)
  url.searchParams.delete('code')
  url.searchParams.delete('state')
  window.history.replaceState({}, document.title, url.toString())
}
