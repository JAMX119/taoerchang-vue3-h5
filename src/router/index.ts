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
      path: '/barrage_demo',
      name: 'barrage_demo',
      component: () => import('@/views/BarrageDemo/index.vue'),
    },
  ],
})

router.beforeEach((to, from) => {
  console.log('to', to)
  console.log('from', from)
  const { isLoggedIn } = useUserInfoStore()
  console.log('isLoggedIn', isLoggedIn)
  if (to.name !== 'authorize' && !isLoggedIn) {
    return { name: 'authorize' }
  }
  // 返回 false 以取消导航
  return true
})

export default router
