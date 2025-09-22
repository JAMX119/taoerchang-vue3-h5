<script setup lang="ts">
defineOptions({
  name: 'AppBackground',
})
</script>

<template>
  <div
    class="bg-[url('@/assets/images/background.png')] bg-cover bg-center bg-fixed min-h-screen h-auto flex flex-col"
  >
    <div class="h5-safe-top"></div>
    <slot></slot>
    <div class="h5-safe-bottom"></div>
  </div>
</template>

<style scoped></style>
