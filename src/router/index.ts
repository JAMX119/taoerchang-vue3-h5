import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '/',
      component: () => import('@/views/Home/index.vue'),
    },
    {
      path: '/send_barrage',
      name: 'send_barrage',
      component: () => import('@/views/SendBarrage/index.vue'),
    },
  ],
})

export default router
