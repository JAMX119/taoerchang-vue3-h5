import { defineStore } from 'pinia'
import { ref } from 'vue'
import { postSendDanmaku, getDanmakuList, getWelcomeList, getBackground } from '@/api'
import type { PostSendDanmakuData, Barrage, WelcomeBarrage } from '@/types'
import { useLoginStore } from './login'

const loginStore = useLoginStore()

export const useBarrageStore = defineStore('barrage', () => {
  // 发送次数
  const sendCount = ref(Number(localStorage.getItem('sendCount')) || 0)
  // 发送最大次数
  const maxSendCount = 50
  // 最近一次发送时间
  const lastSendTime = ref(localStorage.getItem('lastSendTime') || null)
  // 弹幕发送时间间隔
  const sendInterval = 30000
  // 弹幕列表获取时间间隔
  const getBarrageInterval = 3000
  // 弹幕列表
  const danmus = ref<Barrage[] | null>([])
  // 是否正在发送中（用于节流）
  const isSending = ref(false)
  // 定时器ID，用于清理
  const intervalId = ref<number | null>(null)
  // 弹幕欢迎列表
  const welcomeList = ref<WelcomeBarrage[] | null>([])
  // 背景图片/视频
  const background = ref<[] | string | null>(null)

  // 发送弹幕
  async function activeSendBarrage(data: PostSendDanmakuData) {
    // 节流检查：如果正在发送中，则不执行
    if (isSending.value) {
      return Promise.reject('正在发送中，请稍后再试')
    }

    // 如果有发送时间 且 发送时间是当天时间 且 发送次数大于等于最大次数
    if (
      !!lastSendTime.value &&
      !lastSendTime.value.indexOf(new Date().toLocaleDateString()) &&
      Number(sendCount.value) >= maxSendCount
    ) {
      return Promise.reject('发送次数已达上限')
    }
    // 发送时间 小于上次 发送时间间隔时间
    if (
      !!lastSendTime.value &&
      new Date().getTime() - new Date(lastSendTime.value).getTime() < sendInterval
    ) {
      return Promise.reject('发送间隔过短')
    }
    //没有发送时间 或者 发送时间不是当天时间
    if (!lastSendTime.value || !!lastSendTime.value.indexOf(new Date().toLocaleDateString())) {
      // 重置发送次数
      sendCount.value = 0
    }
    // 设置节流标志
    isSending.value = true
    try {
      // 发送弹幕接口
      const res = await postSendDanmaku(
        {
          company_id: loginStore.company_id,
          dep_code: loginStore.dep_code,
        },
        data,
      )
      // 发送成功
      console.log('发送成功')
      // 增加发送次数 同步 localStorage
      sendCount.value++
      localStorage.setItem('sendCount', sendCount.value.toString())
      // 更新最近一次发送时间 同步 localStorage
      lastSendTime.value = new Date().toLocaleString(undefined, {
        year: 'numeric' as const,
        month: 'numeric' as const,
        day: 'numeric' as const,
        hour: 'numeric' as const,
        minute: 'numeric' as const,
        second: 'numeric' as const,
        hour12: false,
      })
      localStorage.setItem('lastSendTime', lastSendTime.value)
      return res
    } catch (error) {
      console.log('error', error)
      throw new Error(error as string)
    } finally {
      // 重置节流标志
      isSending.value = false
    }
  }

  // 获取弹幕列表
  async function activeGetDanmakuList() {
    try {
      const data = (await getDanmakuList({
        company_id: loginStore.company_id,
        dep_code: loginStore.dep_code,
      })) as Barrage[]
      // 直接替换整个数组，确保响应式更新
      danmus.value = data.slice(0, 99).reverse() || [] // 确保data不为null/undefined
    } catch (error) {
      console.error('获取弹幕列表失败:', error)
    }
  }

  // 获取弹幕欢迎列表
  async function activeGetWelcomeList() {
    try {
      const data = (await getWelcomeList({
        company_id: loginStore.company_id,
        dep_code: loginStore.dep_code,
      })) as WelcomeBarrage[]
      welcomeList.value = data || [] // 确保data不为null/undefined
    } catch (error) {
      console.error('获取弹幕欢迎列表失败:', error)
    }
  }

  // 获取背景图片/视频
  async function activeGetBackground() {
    try {
      const data = (await getBackground({
        company_id: loginStore.company_id,
        dep_code: loginStore.dep_code,
        id: 29539,
      })) as {
        pic_arr?: []
        video_link?: string
      }
      // 直接替换整个数组，确保响应式更新
      if (data?.pic_arr?.length) {
        background.value = data?.pic_arr || [] // 确保data不为null/undefined
      } else {
        background.value = data?.video_link || null // 确保data不为null/undefined
      }
    } catch (error) {
      console.error('获取背景图片/视频失败:', error)
    }
  }

  // 定时获取弹幕列表
  async function intervalGetBarrageList(cb?: () => void) {
    // 先清除可能存在的旧定时器
    if (intervalId.value) {
      clearInterval(intervalId.value)
    }

    // 立即执行一次
    await activeGetDanmakuList()
    await activeGetWelcomeList()
    cb?.()

    // 设置新的定时器并保存ID
    intervalId.value = setInterval(async () => {
      await activeGetDanmakuList()
      await activeGetWelcomeList()
      cb?.()
    }, getBarrageInterval)
  }

  // 停止定时获取弹幕列表
  function stopIntervalGetBarrageList() {
    if (intervalId.value) {
      clearInterval(intervalId.value)
      intervalId.value = null
      console.log('已停止定时获取弹幕列表')
    }
  }

  return {
    danmus,
    welcomeList,
    background,
    activeSendBarrage,
    activeGetDanmakuList,
    activeGetWelcomeList,
    activeGetBackground,
    intervalGetBarrageList,
    stopIntervalGetBarrageList,
  }
})
