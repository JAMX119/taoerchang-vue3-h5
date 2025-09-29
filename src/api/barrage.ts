import { get, post, paramsToQuery } from './request'
import type { PostToeknParams, PostSendDanmakuData } from '@/types'

/**
 * 发送弹幕
 * @param params 请求参数，PostToeknParams
 * @param data 请求参数，PostSendDanmakuData
 * @returns
 */
export const postSendDanmaku = (params: PostToeknParams, data: PostSendDanmakuData) => {
  return post('/api/danmaku/send/danmaku?' + paramsToQuery(params), data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

/**
 * 获取弹幕列表
 * @param params 请求参数，PostToeknParams
 * @returns
 */
export const getDanmakuList = (params: PostToeknParams) => {
  return get('/api/danmaku/get/danmaku/list', params, {})
}

/**
 * 获取弹幕欢迎列表
 * @param params 请求参数，PostToeknParams
 * @returns
 */
export const getWelcomeList = (params: PostToeknParams) => {
  return get('/api/danmaku/get/welcome/list', params, {})
}

/**
 * 获取背景图片/视频
 * @param params 请求参数，PostToeknParams
 * @returns
 */
export const getBackground = (params: PostToeknParams) => {
  return get('/api/common/matter/new/detail', params, {})
}
