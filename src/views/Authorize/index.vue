<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginStore } from '@/stores/login'
import { buildWechatAuthUrl, getCodeFromUrl, removeCodeFromUrl } from '@/utils/wechat-auth'

defineOptions({
  name: 'AuthorizeIndex',
})

// 路由
const router = useRouter()
// store
const loginStore = useLoginStore()
// data
const loading = ref(false)
const error = ref('')
const replaceHome = () => {
  router.replace('/home')
}
// 微信授权逻辑
const handleWechatAuth = async () => {
  loading.value = true
  error.value = ''

  try {
    // 检查URL中是否有授权code
    const code = getCodeFromUrl()
    if (code) {
      // 有code，尝试获取用户信息
      console.log('获取到授权code:', code)
      // 调用store的action获取用户信息
      await loginStore.actionGetUserInfo(code)
      // 调用store的action获取token
      await loginStore.actionPostToekn()
      // 移除URL中的code参数，避免重复授权
      removeCodeFromUrl()
      // 授权成功后重定向到首页或其他页面
      replaceHome()
    } else {
      // 没有code，检查本地是否有用户信息
      if (loginStore.wechatUserInfo) {
        // 调用store的action获取token
        await loginStore.actionPostToekn()
        replaceHome()
        return
      }
      // 没有code，重定向到微信授权页面
      console.log('未检测到授权code，重定向到微信授权页面')
      // 构建回调URL（当前页面URL）
      const redirectUri = window.location.origin + window.location.pathname
      try {
        // const authUrl = await store.actionGetAuthUrl(redirectUri)
        const authUrl = buildWechatAuthUrl(redirectUri)
        // 跳转到微信授权页面
        window.location.href = authUrl as string
      } catch (error) {
        console.error('获取授权链接失败，使用前端构建的链接:', error)
      }
    }
  } catch (err) {
    error.value = '微信授权失败，请稍后重试'
    console.error('微信授权错误:', err)
  } finally {
    loading.value = false
  }
}
// 组件挂载时执行授权逻辑
onMounted(() => {
  handleWechatAuth()
})
</script>

<template>
  <div class="authorize-container">
    <!-- <div class="authorize-content">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p class="loading-text">正在进行微信授权...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <p class="error-text">{{ error }}</p>
        <button class="retry-button h-20" @click="handleWechatAuth">重新授权</button>
      </div>

      <div v-else-if="loginStore.wechatUserInfo" class="success-state">
        <div class="user-avatar">
          <img :src="loginStore.wechatUserInfo.avatar" alt="用户头像" />
        </div>
        <h3 class="user-nickname">{{ loginStore.wechatUserInfo.nick_name || '微信用户' }}</h3>
        <p class="authorize-success-text">授权成功，正在跳转到首页...</p>
      </div>

      <div v-else class="default-state">
        <p class="welcome-text">欢迎使用微信授权登录</p>
        <button class="auth-button" @click="handleWechatAuth">开始微信授权</button>
      </div>
    </div> -->
  </div>
</template>

<style scoped>
.authorize-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
}

.authorize-content {
  width: 80%;
  max-width: 400px;
  text-align: center;
  padding: 40px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 加载状态样式 */
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #07c160;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

.loading-text {
  color: #666;
  font-size: 16px;
}

/* 错误状态样式 */
.error-text {
  color: #ff4d4f;
  font-size: 16px;
  margin-bottom: 20px;
}

.retry-button {
  background-color: #07c160;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 24px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.retry-button:hover {
  background-color: #06ad56;
}

/* 授权成功状态样式 */
.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 20px;
  border: 3px solid #07c160;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-nickname {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.authorize-success-text {
  color: #666;
  font-size: 16px;
}

/* 默认状态样式 */
.welcome-text {
  font-size: 18px;
  color: #333;
  margin-bottom: 30px;
}

.auth-button {
  background-color: #07c160;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 24px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.auth-button:hover {
  background-color: #06ad56;
}

/* 动画效果 */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
