<script setup lang="ts">
import AppBackground from '@/components/background.vue'
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'
defineOptions({
  name: 'SendBarrageIndex',
})
// 路由返回
const router = useRouter()
const handleBackClick = () => {
  router.back()
}
// 定义颜色选项
const colorOptions = [
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
const selectedColor = ref('#ffffff')
const handleColorSelect = (color: string) => {
  selectedColor.value = color
}
// 弹窗
const visible = ref(false)
// 发送按钮点击
const handleSendClick = async () => {
  visible.value = true
  document.body.style.height = '100vh'
  document.body.style.overflow = 'hidden'
}
// 关闭弹窗
const handleCloseClick = () => {
  visible.value = false
  document.body.style.height = 'auto'
  document.body.style.overflow = 'auto'
}
// 弹幕内容
const barrageText = ref('')
const isPlaceholder = computed(() => {
  if (barrageText.value.trim() === '') {
    return true
  }
  return false
})
</script>

<template>
  <AppBackground>
    <header class="fixed top-0 left-0 right-0 flex items-center justify-between !p-6 z-50">
      <div
        @click="handleBackClick"
        class="text-[#e4cec4] font-bold !text-4xl cursor-pointer flex items-center space-x-2"
      >
        <img src="@/assets/images/arrow-left.png" alt="arrow-left" class="w-12" />
        <span>返回</span>
      </div>
    </header>
    <main class="flex-1 flex flex-col items-center !pt-24">
      <!-- 输入框 -->
      <div class="!mx-4 relative">
        <img src="@/assets/images/input_box.png" alt="input-box" />
        <div class="textarea absolute bottom-0 h-[60%] left-0 w-full !p-[3%]">
          <div v-show="isPlaceholder" class="placeholder absolute !text-4xl text-white font-bold">
            发个友善的弹幕见证当下(输入文字区)
            <span class="icon iconfont icon-qianbi !text-4xl"></span>
          </div>
          <img
            class="absolute w-[20%] bottom-[8%] right-[5%]"
            src="@/assets/images/black_pot.png"
          />
          <textarea
            v-model="barrageText"
            class="relative z-[1] w-full h-[60%] bg-transparent resize-none outline-none font-bold text-white !text-4xl"
          ></textarea>
        </div>
      </div>
      <!-- 颜色设置 -->
      <div class="color-setting w-full max-w-md mx-auto overflow-hidden !mt-10">
        <!-- 颜色设置标题 -->
        <div
          class="bg-[#d65879] text-white font-bold text-lg !px-4 !py-2 text-center inline-block border-2 border-white rounded-t-xl shadow-[#333_0_5px_6px]"
        >
          颜色设置
        </div>
        <div class="bg-white !p-2 rounded-xl !mt-[-0.5rem] relative">
          <div class="border border-[#ee829b] rounded-xl !p-4">
            <!-- 颜色值显示 -->
            <div class="px-4 py-3 flex items-center space-x-3">
              <div
                class="flex-1 bg-[#ed7b9e] text-white !px-2 rounded !mr-4 h-8 font-bold text-2xl text-left uppercase"
              >
                {{ selectedColor }}
              </div>
              <div class="w-30 h-8 border border-[#ed7b9e] rounded"></div>
            </div>

            <!-- 颜色选择按钮 -->
            <div class="!p-4 grid grid-cols-7 gap-4">
              <div
                v-for="(color, index) in colorOptions"
                :key="index"
                @click="handleColorSelect(color)"
                :style="{ backgroundColor: color }"
                :class="{
                  'border border-gray': color === '#ffffff',
                  'ring-2 ring-offset-2 ring-[#e84075]': selectedColor === color,
                }"
                class="w-8 h-8 rounded-full cursor-pointer transition-transform hover:scale-110"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <!-- 发送按钮 -->
      <div class="!my-20" @click="handleSendClick">
        <img class="w-50" src="@/assets/images/send_button.png" />
      </div>
    </main>
  </AppBackground>
  <!-- 弹窗 -->
  <Teleport to="body">
    <div
      v-show="visible"
      class="fixed flex-col top-0 left-0 right-0 flex items-center justify-center z-50 h-full bg-white/50"
    >
      <div class="relative">
        <img class="w-80" src="@/assets/images/send_success.png" alt="send-success" />
        <div class="w-15 h-15 absolute right-10 top-2" @click="handleCloseClick"></div>
      </div>
      <img class="w-40 !mt-30" src="@/assets/images/bot.png" alt="bot" />
    </div>
  </Teleport>
</template>

<style scoped>
/* 动画效果 */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(-20px) translateX(-50%);
  }
  to {
    opacity: 1;
    transform: translateY(0) translateX(-50%);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.3s ease-out;
}
</style>
