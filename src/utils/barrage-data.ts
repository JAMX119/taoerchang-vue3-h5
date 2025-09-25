// 生成100条随机弹幕数据
import { v4 as uuidv4 } from 'uuid'
import { mock } from 'mockjs'

interface Barrage {
  id: string
  color: string
  content: string
  time: number
}

// 定义颜色选项
const colors = [
  '#e7211a', // 红色
  '#ec661a', // 橙色
  '#f4a018', // 黄色
  '#f5ca1f', // 浅黄色
  '#efea3c', // 浅绿色
  '#8ec32c', // 绿色
  '#4cb134', // 深绿色
  '#006464', // 青色
  '#3663ae', // 蓝色
  '#74caef', // 浅蓝色
  '#cf156d', // 紫色
  '#212222', // 黑色
  '#9b9a9b', // 灰色
  '#ffffff', // 白色
]

// 生成随机颜色
function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colors.length)
  return colors[randomIndex]
}

// 生成100条随机弹幕数据
const randomBarrages: Barrage[] = Array.from({ length: 100 }, (_, index) => ({
  id: uuidv4(),
  color: getRandomColor(),
  // 使用mock生成随机长度的中文内容
  content: mock('@cword(10, 30)'),
  time: Date.now(),
}))

export default randomBarrages
