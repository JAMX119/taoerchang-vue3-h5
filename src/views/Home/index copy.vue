<template>
  <div class="wechat-auth-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p class="loading-text">{{ loadingText }}</p>
      </div>
    </div>

    <!-- 用户信息展示区域 -->
    <div v-if="userInfo" class="user-info-section">
      <div class="avatar-container">
        <img :src="userInfo.avatarUrl" alt="用户头像" class="user-avatar" />
      </div>
      <h2 class="user-nickname">{{ userInfo.nickname }}</h2>
      <div class="user-details">
        <p>性别：{{ userInfo.gender === 1 ? '男' : userInfo.gender === 2 ? '女' : '未知' }}</p>
        <p>地区：{{ userInfo.country }} {{ userInfo.province }} {{ userInfo.city }}</p>
      </div>
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </div>

    <!-- 授权按钮区域 -->
    <div v-else class="auth-section">
      <h1 class="page-title">欢迎使用</h1>
      <p class="page-description">请点击下方按钮获取您的微信基本信息</p>
      <button class="auth-btn" @click="handleWechatAuth">微信授权登录</button>
      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  wechatAuthFlow,
  getUserInfoFromLocal,
  clearUserInfo,
  getCodeFromUrl,
  getWechatUserInfo,
  removeCodeFromUrl,
  saveUserInfo,
} from '@/utils/wechat-auth'

// 状态定义
interface WechatUserInfo {
  avatarUrl: string
  nickname: string
  gender: number
  country: string
  province: string
  city: string
}

const userInfo = ref<WechatUserInfo | null>(null)
const loading = ref<boolean>(false)
const loadingText = ref<string>('请稍候...')
const error = ref<string>('')

// 处理微信授权
const handleWechatAuth = async () => {
  loading.value = true
  loadingText.value = '正在跳转到微信授权页面...'
  error.value = ''

  try {
    const result = await wechatAuthFlow()
    if (result.success && result.userInfo) {
      userInfo.value = result.userInfo
    } else if (result.error) {
      error.value = result.error
    }
  } catch (err) {
    error.value = '授权过程中发生错误'
    console.error('微信授权失败:', err)
  } finally {
    loading.value = false
  }
}

// 处理退出登录
const handleLogout = () => {
  clearUserInfo()
  userInfo.value = null
  error.value = ''
}

// 组件挂载时检查授权状态
onMounted(() => {
  // 检查URL中是否有code参数
  const code = getCodeFromUrl()

  if (code) {
    // 有code，尝试自动获取用户信息
    loading.value = true
    loadingText.value = '正在获取用户信息...'

    getWechatUserInfo(code)
      .then((info) => {
        userInfo.value = info
        saveUserInfo(info)
        removeCodeFromUrl()
      })
      .catch((err) => {
        error.value = '获取用户信息失败'
        console.error('获取用户信息失败:', err)
      })
      .finally(() => {
        loading.value = false
      })
  } else {
    // 没有code，检查本地是否有用户信息
    const localUserInfo = getUserInfoFromLocal()
    if (localUserInfo) {
      userInfo.value = localUserInfo
    }
  }
})
</script>

<style scoped>
.wechat-auth-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f5f5f5;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4caf50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 16px;
  color: #333;
}

.user-info-section {
  text-align: center;
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.avatar-container {
  margin-bottom: 20px;
}

.user-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #4caf50;
}

.user-nickname {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.user-details {
  margin-bottom: 20px;
}

.user-details p {
  margin: 5px 0;
  color: #666;
}

.logout-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #d32f2f;
}

.auth-section {
  text-align: center;
  background-color: white;
  padding: 40px 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.page-description {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
}

.auth-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s;
  min-width: 200px;
}

.auth-btn:hover {
  background-color: #45a049;
}

.error-message {
  color: #f44336;
  margin-top: 20px;
  font-size: 14px;
}
</style>
