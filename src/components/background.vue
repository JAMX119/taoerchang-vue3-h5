<script setup lang="ts">
import defaultBackgroundImage from '@/assets/images/background.png'
defineOptions({
  name: 'AppBackground',
})

defineProps({
  backgroundImage: {
    type: String,
    default: defaultBackgroundImage,
  },
})
</script>

<template>
  <div
    :style="{ backgroundImage: `url(${backgroundImage})` }"
    :class="`bg-cover bg-center bg-fixed min-h-screen h-auto flex flex-col`"
  >
    <div class="h5-safe-top"></div>
    <slot></slot>
    <div class="h5-safe-bottom"></div>
  </div>
</template>

<style scoped></style>
