import { createRouter, createWebHistory } from 'vue-router'
import { useUserInfoStore } from '@/stores/userinfo' // 导入 useUserInfoStore

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '/',
      redirect: '/authorize',
    },
    {
      path: '/authorize',
      name: 'authorize',
      component: () => import('@/views/Authorize/index.vue'),
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/Home/index.vue'),
    },
    {
      path: '/send_barrage',
      name: 'send_barrage',
      component: () => import('@/views/SendBarrage/index.vue'),
    },
    {
      path: '/large_screen',
      name: 'large_screen',
      component: () => import('@/views/LargeScreen/index.vue'),
    },
  ],
})

router.beforeEach((to, from) => {
  const { isLoggedIn } = useUserInfoStore()
  if (to.name == 'large_screen' && !isLoggedIn) {
    return true
  }
  if (to.name !== 'authorize' && !isLoggedIn) {
    return { name: 'authorize' }
  }
  return true
})

export default router
