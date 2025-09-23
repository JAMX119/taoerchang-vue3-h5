import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { WechatUserInfo, WechatAuthUrlResponse } from '@/types'
import { getWechatUserInfo, getWechatAuthUrl } from '@/api/wechat'

export const useUserInfoStore = defineStore('userinfo', () => {
  // 微信用户信息
  const wechatUserInfo = ref<WechatUserInfo | null>(null)

  // 初始化时从localStorage加载用户信息
  const storedUserInfo = localStorage.getItem('wechatUserInfo')
  if (storedUserInfo) {
    wechatUserInfo.value = JSON.parse(storedUserInfo) as WechatUserInfo
  }

  // 是否已登录
  const isLoggedIn = computed(() => {
    return wechatUserInfo.value !== null
  })

  async function actionGetUserInfo(code: string) {
    try {
      const userInfo = (await getWechatUserInfo({ code })) as WechatUserInfo
      setWechatUserInfo(userInfo)
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  }

  async function actionGetAuthUrl(redirectUri: string) {
    try {
      const { authUrl } = (await getWechatAuthUrl({ redirectUri })) as WechatAuthUrlResponse
      return authUrl
    } catch (error) {
      console.error('获取授权URL失败:', error)
    }
  }

  // 设置微信用户信息
  function setWechatUserInfo(userInfo: WechatUserInfo | null) {
    localStorage.setItem('wechatUserInfo', JSON.stringify(userInfo))
    wechatUserInfo.value = userInfo
  }

  // 清空用户信息（退出登录）
  function clearUserInfo() {
    localStorage.removeItem('wechatUserInfo')
    wechatUserInfo.value = null
  }

  return {
    wechatUserInfo,
    isLoggedIn,
    actionGetUserInfo,
    actionGetAuthUrl,
    setWechatUserInfo,
    clearUserInfo,
  }
})
