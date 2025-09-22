<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppBackground from '@/components/background.vue'

defineOptions({
  name: 'HomeIndex',
})

const router = useRouter()

const handleSendBarrageClick = () => {
  router.push('/send_barrage')
}
</script>

<template>
  <AppBackground>
    <!-- 首页顶部导航 -->
    <header class="flex items-center justify-between !p-6">
      <div class="iconfont icon-bilibili text-[#e84075] !text-4xl"></div>
      <img src="@/assets/images/logo.png" alt="logo" class="w-30" />
    </header>
    <!-- 首页主要内容 -->
    <main class="flex flex-1 flex-col items-center justify-center">
      <div class="!px-4">
        <img src="@/assets/images/large_screen.png" alt="large_screen" />
      </div>
      <div class="w-50 !mt-20" @click="handleSendBarrageClick">
        <img src="@/assets/images/send_barrage.png" alt="btn" />
      </div>
      <div class="!mt-20 text-[#815c48] font-bold flex items-center space-x-3 !mb-20">
        <!-- 自定义复选框容器 -->
        <label for="privacy-checkbox" class="relative cursor-pointer flex items-center space-x-2">
          <!-- 隐藏原生复选框 -->
          <input type="checkbox" id="privacy-checkbox" class="sr-only" />
          <!-- 自定义复选框 -->
          <div class="relative">
            <!-- 复选框背景 -->
            <div
              class="w-5 h-5 border-2 border-[#815c48] rounded transition-colors duration-200 hover:border-[#5a3e31]"
            ></div>
            <!-- 复选框勾选图标 -->
            <div
              class="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-3 h-3 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
          <!-- 复选框标签 -->
          <span class="!ml-2">我已阅读并同意相关用户隐私协议</span>
        </label>
      </div>
    </main>
  </AppBackground>
</template>

<style scoped>
/* 自定义复选框样式 */
#privacy-checkbox:checked + .relative .border-\[\#815c48\] {
  background-color: #815c48;
}

#privacy-checkbox:checked + .relative .opacity-0 {
  opacity: 1;
}
</style>
