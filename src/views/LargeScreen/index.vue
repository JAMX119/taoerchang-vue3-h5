<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Danmaku from 'danmaku-vue'
import { useBarrageStore } from '@/stores/barrage'
import { useUserInfoStore } from '@/stores/userinfo'

defineOptions({
  name: 'LargeScreen',
})
// 弹幕列表
const barrageStore = useBarrageStore()
const userInfoStore = useUserInfoStore()
// 欢迎文本动画控制
const welcomeVisible = ref<boolean>(true)
const welcomeAnimation = ref<string>('fade-in')
// 弹幕组件实例
const danmakuRef = ref<InstanceType<typeof Danmaku> | null>(null)

// 组件挂载后触发欢迎文本动画
onMounted(() => {
  // 显示2秒后开始淡出
  setTimeout(() => {
    welcomeAnimation.value = 'fade-out'
    // 淡出动画完成后隐藏
    setTimeout(() => {
      welcomeVisible.value = false
    }, 400)
  }, 2000)
})
</script>

<template>
  <!-- 首页主要内容 -->
  <main class="h-screen flex flex-1 flex-col items-center justify-center">
    <!-- 16:9 比例的视频尺寸容器 (使用Tailwind CSS) -->
    <div class="w-full relative aspect-4/3 bg-black">
      <Danmaku
        class="!absolute top-10 left-0 bottom-10 w-full"
        loop
        useSlot
        :channels="8"
        :speeds="60"
        :danmus="barrageStore.danmus"
        ref="danmakuRef"
      >
        <template #dm="{ danmu }">
          <div class="danmu-item">
            <div class="text-[2rem] line-height-[5rem] mx-10" :style="{ color: danmu.color }">
              {{ danmu.content }}
            </div>
          </div>
        </template>
      </Danmaku>
      <div
        v-show="welcomeVisible"
        :class="[
          'welcome absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold w-[90%] text-center text-[1.3rem] text-[#E5C241]',
          'animate-' + welcomeAnimation,
        ]"
      >
        欢迎{{ userInfoStore.wechatUserInfo?.nickname || 'xxx' }}来到bilibili纪录片创新空间
      </div>
    </div>
  </main>
</template>

<style scoped>
/* 自定义复选框样式 */
#privacy-checkbox:checked + .relative .border-\[\#815c48\] {
  background-color: #815c48;
}

#privacy-checkbox:checked + .relative .opacity-0 {
  opacity: 1;
}

.welcome {
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(4px);
  padding: 1rem;
  border-radius: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
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

/* 欢迎文本淡入动画 */
.animate-fade-in {
  animation: fadeInScale 0.5s ease-out;
}

/* 欢迎文本淡出动画 */
.animate-fade-out {
  animation: fadeOutScale 0.5s ease-in;
}

/* 淡入并放大效果 */
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: translate(0%, 0%) scale(0.8);
  }
  50% {
    opacity: 1;
    transform: translate(0%, 0%) scale(1.05);
  }
  to {
    opacity: 1;
    transform: translate(0%, 0%) scale(1);
  }
}

/* 淡出并缩小效果 */
@keyframes fadeOutScale {
  from {
    opacity: 1;
    transform: translate(0%, 0%) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(0%, 0%) scale(0.8);
  }
}
</style>
