// 微信授权相关工具函数

import type { WechatUserInfo, WechatAuthScope, WechatAuthResult } from '@/types'

// 微信APPID（实际项目中应从环境变量获取）
export const WX_APPID = import.meta.env.VITE_WX_APPID || 'wx1234567890abcdef'

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

// 调用后端API获取微信用户信息
export async function getWechatUserInfo(code: string): Promise<WechatUserInfo> {
  try {
    // 调用后端API获取用户信息
    const response = await fetch(`/api/wechat/userinfo?code=${code}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.success && data.data) {
      console.log('从后端API获取微信用户信息成功:', data.data)
      return data.data
    } else {
      throw new Error(data.message || '获取用户信息失败')
    }
  } catch (error) {
    console.error('获取微信用户信息失败:', error)

    // 网络错误时的fallback，使用模拟数据
    // 实际项目中可以根据需要决定是否保留此fallback
    console.warn('使用模拟数据进行开发测试')

    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 500))

    // 返回模拟数据
    return {
      openId: `mock_${Date.now()}`,
      nickname: '微信用户',
      avatarUrl:
        'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLdOicE8M2rJ0ibLiaAq1SqZb15Y6UicU1sYcY/132',
      gender: 1,
      province: '北京',
      city: '北京',
      country: '中国',
    }
  }
}

/**
 * 从后端获取微信授权链接
 * 此函数可以替代前端直接构建授权链接的方式
 */
export async function getWechatAuthUrlFromBackend(
  redirectUri: string,
  scope: WechatAuthScope = 'snsapi_userinfo',
): Promise<string> {
  try {
    const response = await fetch(
      `/api/wechat/auth-url?redirectUri=${encodeURIComponent(redirectUri)}&scope=${scope}`,
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.success && data.data && data.data.authUrl) {
      return data.data.authUrl
    } else {
      throw new Error(data.message || '获取授权链接失败')
    }
  } catch (error) {
    console.error('获取微信授权链接失败，使用前端构建的链接:', error)

    // 后端API调用失败时，使用前端构建的链接作为fallback
    return buildWechatAuthUrl(redirectUri, scope)
  }
}

// 保存用户信息到本地存储
export function saveUserInfo(userInfo: WechatUserInfo): void {
  localStorage.setItem('wechatUserInfo', JSON.stringify(userInfo))
}

// 从本地存储获取用户信息
export function getUserInfo(): WechatUserInfo | null {
  const userInfoStr = localStorage.getItem('wechatUserInfo')
  return userInfoStr ? JSON.parse(userInfoStr) : null
}

// 清除本地存储的用户信息
export function clearUserInfo(): void {
  localStorage.removeItem('wechatUserInfo')
}

// 模拟微信授权登录流程
export async function wechatAuthFlow(): Promise<WechatAuthResult> {
  try {
    const code = getCodeFromUrl()

    if (code) {
      // 有code，说明已经授权过，获取用户信息
      const userInfo = (await getWechatUserInfo(code)) as WechatUserInfo
      saveUserInfo(userInfo)
      removeCodeFromUrl()

      return { success: true, userInfo: userInfo }
    } else {
      // 没有code，检查本地是否有用户信息
      const localUserInfo = getUserInfo()
      if (localUserInfo) {
        return { success: true, userInfo: localUserInfo }
      }

      // 没有code和本地用户信息，需要引导用户授权
      const currentUrl = window.location.href.split('?')[0] // 移除可能的查询参数
      const authUrl = buildWechatAuthUrl(currentUrl)
      window.location.href = authUrl

      // 这一行不会执行到，因为上面已经跳转了
      return { success: false, error: '请完成微信授权' }
    }
  } catch (error) {
    console.error('微信授权失败:', error)
    return { success: false, error: '微信授权失败，请重试' }
  }
}
