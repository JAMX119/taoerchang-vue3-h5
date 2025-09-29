<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppBackground from '@/components/background.vue'
import { useHomeStore } from '@/stores/home'

defineOptions({
  name: 'HomeIndex',
})
// 路由
const router = useRouter()
// 用户隐私存储
const homeStore = useHomeStore()
// chebox
const isShowTip = ref<boolean>(false)
const isAnimating = ref<boolean>(false)
// 发送弹幕
const handleSendBarrageClick = () => {
  if (!homeStore.privacyCheckbox) {
    isShowTip.value = true
    return
  }
  router.push('/send_barrage')
}
// 监听复选框变化
watch(
  () => homeStore.privacyCheckbox,
  (newValue) => {
    if (newValue) {
      isShowTip.value = false
    }
  },
)

// 监听提示显示状态，触发动画
watch(isShowTip, (newValue) => {
  if (newValue) {
    // 强制重排以确保动画每次都能触发
    isAnimating.value = false
    // 使用$nextTick确保DOM更新后再触发动画
    setTimeout(() => {
      isAnimating.value = true
    }, 10)
  }
})

// 图片动画控制
const imageAnimation = ref<string>('')

// 组件挂载后触发图片动画
onMounted(() => {
  imageAnimation.value = 'fly-in'
})
</script>

<template>
  <AppBackground>
    <!-- 首页顶部导航 -->
    <header class="flex items-center justify-between !px-6 !pt-8 !pb-4">
      <div class="iconfont icon-bilibili text-[#e84075] !text-4xl"></div>
      <img src="@/assets/images/logo.png" alt="logo" class="w-30" />
    </header>
    <!-- 首页主要内容 -->
    <main class="flex flex-1 flex-col items-center justify-center">
      <div class="relative w-full !px-4 !mt-28">
        <!-- 16:9 比例的视频尺寸容器 (使用Tailwind CSS) -->
        <div class="w-full relative overflow-hidden">
          <div :class="['w-full h-full animate-' + imageAnimation]">
            <img
              class="object-fill w-full h-full"
              src="@/assets/images/large_screen.png"
              alt="large_screen"
            />
          </div>
        </div>
      </div>
      <div class="w-50 !mt-15" @click="handleSendBarrageClick">
        <img src="@/assets/images/send_barrage.png" alt="btn" />
      </div>
      <div class="!mt-8 text-[#815c48] font-bold flex items-center space-x-3">
        <label for="privacy-checkbox" class="relative cursor-pointer flex items-center space-x-2">
          <!-- 隐藏原生复选框 -->
          <input
            v-model="homeStore.privacyCheckbox"
            type="checkbox"
            id="privacy-checkbox"
            class="sr-only"
          />
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
      <span
        :style="{ visibility: isShowTip ? 'visible' : 'hidden' }"
        :class="['!my-3 font-black text-[#f00]', { 'animate-shake': isAnimating }]"
      >
        请先勾选隐私条款
      </span>
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

/* 抖动动画 */
.animate-shake {
  animation: shake 0.6s ease-in-out;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-4px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(4px);
  }
}

/* 图片飞入动画 */
.animate-fly-in {
  animation: flyIn 1s forwards;
}

@keyframes flyIn {
  from {
    /* 初始状态：小尺寸、透明、在远处 */
    opacity: 0;
    transform: scale(0.8) translateZ(-10px);
  }
  to {
    /* 结束状态：正常尺寸、完全清晰、当前位置 */
    opacity: 1;
    transform: scale(1) translateZ(0);
  }
}
</style>
