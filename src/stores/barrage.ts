import { ref } from 'vue'
import { defineStore } from 'pinia'
import randomBarrages from '@/utils/barrage-data'

interface Barrage {
  id: string
  color: string
  content: string
  time: number
}

export const useBarrageStore = defineStore('barrage', () => {
  // 弹幕列表
  const danmus = ref<Barrage[]>([])
  // 初始化弹幕列表
  danmus.value = randomBarrages

  // 添加弹幕
  function addBarrage(barrage: Barrage) {
    danmus.value.push(barrage)
  }

  return {
    danmus,
    addBarrage,
  }
})
