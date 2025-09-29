<script setup lang="ts">
import AppBackground from '@/components/background.vue'
import { useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import { useBarrageStore } from '@/stores/barrage'
import defaultBackgroundImage from '@/assets/images/background-2.png'

// store
const barrageStore = useBarrageStore()

// 路由返回
const router = useRouter()

defineOptions({
  name: 'SendBarrageIndex',
})

// 返回事件
const handleBackClick = () => {
  router.back()
}

// 选择颜色
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
  '#0CB6F2', // 浅蓝色
  '#FF5588', // 紫色
  '#212222', // 黑色
  '#9b9a9b', // 灰色
  '#ffffff', // 白色
]
const selectedColor = ref('#ffffff')
const handleColorSelect = (color: string) => {
  selectedColor.value = color
}

// 弹幕内容
const barrageText = ref('')
const isPlaceholder = ref(true)
// const isPlaceholder = computed(() => {
//   if (barrageText.value.trim() === '') {
//     return true
//   }
//   return false
// })

// 打字动画相关
const placeholderText = '发个友善的弹幕见证当下(输入文字区)'
const displayedText = ref('')
const typingIndex = ref(0)
const typingSpeed = 100 // 打字速度，毫秒
const timerId = ref<number | null>(null) // 保存定时器ID
const showColorSetting = ref(false) // 控制颜色设置框显示

// 清除定时器函数
const clearTypingTimer = () => {
  if (timerId.value !== null) {
    clearTimeout(timerId.value)
    timerId.value = null
  }
}

// 打字动画函数
const startTypingAnimation = () => {
  // 清除之前的定时器，避免多个定时器同时运行
  clearTypingTimer()

  if (typingIndex.value < placeholderText.length) {
    displayedText.value = placeholderText.slice(0, typingIndex.value + 1)
    typingIndex.value++
    timerId.value = setTimeout(() => {
      startTypingAnimation()
    }, typingSpeed)
  } else {
    // 动画完成后，短暂延迟显示颜色设置框
    timerId.value = setTimeout(() => {
      showColorSetting.value = true
    }, 500)
    // 完成一轮后，短暂停顿再重新开始
    // timerId.value = setTimeout(() => {
    //   typingIndex.value = 0
    //   displayedText.value = ''
    //   startTypingAnimation()
    // }, 2000)
  }
}

// 组件挂载后启动打字动画
onMounted(() => {
  startTypingAnimation()
})

// 监听barrageText变化，当有输入时暂停动画
// watch(barrageText, (newValue) => {
//   if (newValue.trim() !== '') {
//     typingIndex.value = placeholderText.length // 暂停动画
//     clearTypingTimer() // 清除定时器
//   } else if (isPlaceholder.value) {
//     // 清空输入时重新开始动画
//     typingIndex.value = 0
//     displayedText.value = ''
//     startTypingAnimation()
//   }
// })

// 组件卸载时清除定时器，避免内存泄漏
onUnmounted(() => {
  clearTypingTimer()
})

// 弹窗
const visible = ref(false)
// 发送按钮点击
const handleSendClick = async () => {
  if (barrageText.value.trim() === '') {
    return '弹幕内容不能为空'
  }
  try {
    await barrageStore.activeSendBarrage({
      content: barrageText.value,
      font_color: selectedColor.value,
    })
  } catch (error) {
    console.log('error', error)
    return error
  }
  visible.value = true
  document.body.style.height = '100vh'
  document.body.style.overflow = 'hidden'
}
// 关闭弹窗
const handleCloseClick = () => {
  visible.value = false
  document.body.style.height = 'auto'
  document.body.style.overflow = 'auto'
  router.replace({ name: 'home' })
}

const handleFocus = () => {
  isPlaceholder.value = false
}
const handleBlur = () => {
  if (barrageText.value.trim() === '') {
    isPlaceholder.value = true
    // 清空输入时重新开始动画
    typingIndex.value = 0
    displayedText.value = ''
    startTypingAnimation()
  }
}
</script>

<template>
  <AppBackground :backgroundImage="defaultBackgroundImage">
    <header class="fixed top-0 left-0 right-0 flex items-center justify-between !py-6 !px-3 z-50">
      <div
        @click="handleBackClick"
        class="text-[#e4cec4] font-bold !text-4xl cursor-pointer flex items-center space-x-2"
      >
        <img src="@/assets/images/arrow-left.png" alt="arrow-left" class="w-12" />
        <span>返回</span>
      </div>
    </header>
    <main class="flex-1 flex flex-col items-center !pt-6">
      <!-- 输入框 -->
      <div class="!mx-4 relative">
        <img src="@/assets/images/input_box.png" alt="input-box" />
        <div class="textarea absolute bottom-0 h-[60%] left-0 w-full !py-[5%] !px-[7%]">
          <div
            v-show="isPlaceholder"
            class="placeholder absolute left-[6%] right-[6%] !text-[2rem] leading-[2.4rem] text-white font-bold"
          >
            {{ displayedText }}
            <span
              v-if="isPlaceholder && typingIndex < placeholderText.length"
              class="inline-block w-4 h-8 bg-white ml-1 animate-blink"
            ></span>
            <span class="icon iconfont icon-qianbi !text-[2rem]"></span>
          </div>
          <img
            v-show="!visible"
            class="absolute w-[20%] bottom-[8%] right-[5%]"
            src="@/assets/images/black_pot.png"
          />
          <textarea
            v-model="barrageText"
            v-show="showColorSetting"
            :style="{ color: selectedColor }"
            maxlength="30"
            @focus="handleFocus"
            @blur="handleBlur"
            class="relative z-[1] w-full h-[60%] bg-transparent resize-none outline-none font-bold !text-[2rem] leading-[2.4rem]"
          ></textarea>
        </div>
      </div>
      <!-- 颜色设置 -->
      <transition name="fade-in">
        <div v-show="showColorSetting" class="min-w-[60%]">
          <div class="color-setting w-full !px-15 overflow-hidden !mt-8 !pb-2">
            <!-- 颜色设置标题 -->
            <div
              class="bg-[#FF5588] shadow text-white font-bold text-[1.2rem] !px-4 !pt-2 !pb-6 text-center inline-block border-2 border-white rounded-t-xl shadow-[#333_0_5px_6px]"
            >
              颜色设置
            </div>
            <div class="bg-white shadow !p-1 rounded-3xl !mt-[-1.5rem] relative">
              <div class="border border-[#FF5588] rounded-3xl !p-2">
                <!-- 颜色值显示 -->
                <div class="px-3 py-2 flex items-center space-x-3">
                  <div
                    class="flex-1 bg-[#FF5588] text-white !px-2 rounded !mr-4 h-7 font-bold text-xl text-left uppercase"
                  >
                    {{ selectedColor }}
                  </div>
                  <div
                    class="w-22 h-8 border border-[#FF5588] rounded"
                    :style="{ 'background-color': selectedColor }"
                  ></div>
                </div>

                <!-- 颜色选择按钮 -->
                <div class="!px-2 !py-2 grid grid-cols-7 gap-4">
                  <div
                    v-for="(color, index) in colorOptions"
                    :key="index"
                    @click="handleColorSelect(color)"
                    :style="{ backgroundColor: color }"
                    :class="{
                      'border border-gray': color === '#ffffff',
                    }"
                    class="w-7 h-7 rounded-3xl cursor-pointer transition-transform hover:scale-110"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <!-- 发送按钮 -->
          <div class="!my-13 flex items-center justify-center" @click="handleSendClick">
            <img v-show="!visible" class="w-35" src="@/assets/images/send_button.png" />
          </div>
        </div>
      </transition>
    </main>
  </AppBackground>
  <!-- 弹窗 -->
  <Teleport to="body">
    <transition name="dialog">
      <div
        v-show="visible"
        class="mask_layer fixed flex-col top-0 left-0 right-0 flex items-center justify-center z-50 h-full bg-white/90"
      >
        <div class="relative !mt-27">
          <img class="w-80" src="@/assets/images/send_success.png" alt="send-success" />
          <div class="w-15 h-15 absolute right-10 top-2" @click="handleCloseClick"></div>
        </div>
        <img class="w-34 !mt-22" src="@/assets/images/bot.png" alt="bot" />
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
/* 淡入动画 */
.fade-in-enter-active,
.fade-in-leave-active {
  transition: all 0.8s ease;
}

.fade-in-enter-from,
.fade-in-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.mask_layer {
  background-color: rgba(255, 255, 255, 0.8);
}

/* 弹窗过渡动画 */
.dialog-enter-active,
.dialog-leave-active {
  transition: all 0.3s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-from > div,
.dialog-leave-to > div {
  transform: scale(0.8);
  opacity: 0;
}

.dialog-enter-active > div,
.dialog-leave-active > div {
  transition: all 0.3s ease;
}

/* 闪烁光标动画 */
.animate-blink {
  animation: blink 1s infinite;
}

.shadow {
  box-shadow: #333 3px 3px 3px;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
