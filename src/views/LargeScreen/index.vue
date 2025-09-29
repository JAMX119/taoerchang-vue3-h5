<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Danmaku from 'danmaku-vue'
import { useBarrageStore } from '@/stores/barrage'
import type { WelcomeBarrage } from '@/types'
import { ElMessage, ElCarousel, ElCarouselItem } from 'element-plus'
console.log(ElCarousel, ElCarouselItem)

defineOptions({
  name: 'LargeScreen',
})
// 弹幕轨道
const channels = 8
// 弹幕速度
const speeds = 60
// 弹幕列表
const barrageStore = useBarrageStore()
// 弹幕组件实例
const danmakuRef = ref<InstanceType<typeof Danmaku> | null | { reset: () => void }>(null)
// 视频引用，用于手动控制播放
const videoRef = ref<HTMLVideoElement | null>(null)

// 视频加载完成后的处理函数，确保自动播放
const handleVideoLoaded = () => {
  if (videoRef.value) {
    // 尝试播放，如果浏览器限制自动播放，会返回一个Promise
    videoRef.value.play().catch((error) => {
      console.warn('视频自动播放失败，尝试手动播放:', error)
      // 在某些情况下可能需要用户交互才能播放
      // 这里可以添加一个备用方案或提示
    })
  }
}
const onMassage = (element: { nick_name: string }) => {
  const thatMsg = ElMessage({
    duration: 0,
    appendTo: '.welcome-message',
    dangerouslyUseHTMLString: true,
    message: `<div class="welcome whitespace-pre-line text-white text-center text-[3rem]/[4rem]">欢迎${element.nick_name}
来到bilibili纪录片创新空间
</div>`,
  })

  // 1秒后关闭消息
  setTimeout(() => {
    thatMsg.close()
  }, 3000)
}

// 定义延迟函数
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// 使用async/await实现延迟遍历
const showMessagesWithDelay = async (array?: WelcomeBarrage[]) => {
  if (!array || array.length === 0) {
    return
  }

  for (const element of array) {
    // 显示当前消息
    onMassage(element)
    // 等待1秒后再继续下一个
    await delay(1000)
  }
}

barrageStore.intervalGetBarrageList(() => {
  if (danmakuRef.value) {
    danmakuRef.value.reset()
  }
  // 调用异步函数显示消息
  showMessagesWithDelay(barrageStore.welcomeList || [])
})

// 组件挂载后触发欢迎文本动画
onMounted(() => {
  window?.addEventListener('resize', () => {
    danmakuRef.value?.reset()
  })
  barrageStore.activeGetBackground()
})

onUnmounted(() => {
  barrageStore.stopIntervalGetBarrageList()
})
</script>

<template>
  <main class="h-screen flex flex-1 flex-col items-center justify-center">
    <div class="w-screen h-screen relative bg-black">
      <template v-if="Array.isArray(barrageStore.background) && barrageStore.background.length">
        <el-carousel height="100vh" arrow="never" indicator-position="none" :autoplay="false">
          <el-carousel-item
            v-for="(item, index) in barrageStore.background as { pic_url: string }[]"
            :key="'background' + index"
          >
            <img class="w-screen h-screen object-cover" :src="item.pic_url" alt="background" />
          </el-carousel-item>
        </el-carousel>
      </template>
      <template v-else>
        <video
          ref="videoRef"
          autoplay
          loop
          muted
          playsinline
          preload="auto"
          :src="barrageStore.background as string"
          class="w-screen h-screen object-cover"
          @loadeddata="handleVideoLoaded"
        ></video>
      </template>
      <Danmaku
        class="!absolute top-10 left-0 bottom-10 w-full"
        loop
        useSlot
        :channels="channels"
        :speeds="speeds"
        v-model:danmus="barrageStore.danmus as []"
        ref="danmakuRef"
      >
        <template #dm="{ danmu }">
          <div class="danmu-item text-[2rem] leading-[4rem]" :style="{ color: danmu.font_color }">
            {{ danmu.content }}
          </div>
        </template>
      </Danmaku>
    </div>
    <div class="welcome-message"></div>
  </main>
</template>

<style scoped></style>
