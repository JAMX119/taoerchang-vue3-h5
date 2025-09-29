import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useHomeStore = defineStore('home', () => {
  // 用户隐私
  const privacyCheckbox = ref<boolean>(false)

  return {
    privacyCheckbox,
  }
})
