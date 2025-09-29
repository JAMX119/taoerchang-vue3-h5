import { createRouter, createWebHistory } from 'vue-router'
import { useLoginStore } from '@/stores/login' // 导入 useLoginStore

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '/',
      redirect: import.meta.env.MODE !== 'development' ? '/authorize' : '/home',
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

if (import.meta.env.MODE !== 'development') {
  router.beforeEach((to, from) => {
    const { isLoggedIn } = useLoginStore()
    if (to.name === 'large_screen') {
      return true
    }
    if (to.name !== 'authorize' && !isLoggedIn) {
      return { name: 'authorize' }
    }
    return true
  })
}

export default router
