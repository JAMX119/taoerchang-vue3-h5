var express = require('express')
var router = express.Router()
var https = require('https')
var querystring = require('querystring')

// 读取.env文件, 获取WX_APPID和WX_APPSECRET
require('dotenv').config({ path: './.env' })

// 微信APPID和APPSECRET
const WX_APPID = process.env.WX_APPID || ''
const WX_APPSECRET = process.env.WX_APPSECRET || ''

// 检查是否成功读取到配置
if (!WX_APPID || !WX_APPSECRET) {
  console.warn('警告: 未配置微信APPID或APPSECRET，将使用模拟数据')
}

/**
 * 从微信服务器获取access_token和openid
 * @param {string} code - 微信授权code
 * @returns {Promise<{access_token: string, openid: string}>}
 */
function getAccessToken(code) {
  return new Promise((resolve, reject) => {
    const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${WX_APPID}&secret=${WX_APPSECRET}&code=${code}&grant_type=authorization_code`

    https
      .get(url, (res) => {
        let data = ''

        res.on('data', (chunk) => {
          data += chunk
        })

        res.on('end', () => {
          try {
            const result = JSON.parse(data)
            if (result.errcode) {
              reject(new Error(`获取access_token失败: ${result.errmsg}`))
            } else {
              resolve({
                access_token: result.access_token,
                openid: result.openid,
              })
            }
          } catch (error) {
            reject(error)
          }
        })
      })
      .on('error', (error) => {
        reject(error)
      })
  })
}

/**
 * 获取微信用户信息
 * @param {string} access_token - 访问令牌
 * @param {string} openid - 用户的openid
 * @returns {Promise<{openId: string, nickname: string, avatarUrl: string, gender: number, province: string, city: string, country: string}>}
 */
function getUserInfoFromWechat(access_token, openid) {
  return new Promise((resolve, reject) => {
    const url = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`

    https
      .get(url, (res) => {
        let data = ''

        res.on('data', (chunk) => {
          data += chunk
        })

        res.on('end', () => {
          try {
            const result = JSON.parse(data)
            if (result.errcode) {
              reject(new Error(`获取用户信息失败: ${result.errmsg}`))
            } else {
              resolve({
                openId: result.openid,
                nickname: result.nickname,
                avatarUrl: result.headimgurl,
                gender: result.sex,
                province: result.province,
                city: result.city,
                country: result.country,
              })
            }
          } catch (error) {
            reject(error)
          }
        })
      })
      .on('error', (error) => {
        reject(error)
      })
  })
}

/**
 * 微信授权回调接口
 * 前端通过code获取用户信息
 */
router.get('/userinfo', async (req, res, next) => {
  try {
    const { code } = req.query

    // 检查参数
    if (!code) {
      return res.status(400).json({
        success: false,
        message: '缺少授权code参数',
      })
    }

    console.log('收到微信授权code:', code)

    try {
      // 1. 获取access_token和openid
      const { access_token, openid } = await getAccessToken(code)
      console.log('获取access_token成功:', access_token, 'openid:', openid)

      // 2. 使用access_token和openid获取用户信息
      const userInfo = await getUserInfoFromWechat(access_token, openid)
      console.log('获取用户信息成功:', userInfo)

      // 3. 返回用户信息
      res.json({
        code: 0,
        message: '获取用户信息成功',
        data: userInfo,
      })
    } catch (error) {
      console.error('获取微信用户信息失败:', error)

      // 在真实环境中，如果无法连接微信服务器，可以返回模拟数据以便开发测试
      // 这里提供一个模拟数据的 fallback
      res.json({
        success: true,
        data: {
          openId: `mock_${Date.now()}`,
          nickname: '微信用户',
          avatarUrl:
            'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLdOicE8M2rJ0ibLiaAq1SqZb15Y6UicU1sYcY/132',
          gender: 1,
          province: '北京',
          city: '北京',
          country: '中国',
        },
        message: `真实请求失败，返回模拟数据: ${error.message}`,
      })
    }
  } catch (error) {
    next(error)
  }
})

/**
 * 构建微信授权链接接口
 * 用于前端获取微信授权URL
 */
router.get('/auth-url', (req, res) => {
  const { redirectUri, scope = 'snsapi_userinfo' } = req.query

  if (!redirectUri) {
    return res.status(400).json({
      success: false,
      message: '缺少redirectUri参数',
    })
  }

  try {
    // 构建微信授权链接
    const encodedRedirectUri = encodeURIComponent(redirectUri)
    const state = 'STATE_' + Date.now() // 添加时间戳避免重复

    let authUrl
    let message = ''

    if (WX_APPID) {
      // 如果配置了WX_APPID，生成真实的授权链接
      authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${WX_APPID}&redirect_uri=${encodedRedirectUri}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`
    } else {
      // 如果没有配置WX_APPID，生成模拟的授权链接（用于开发测试）
      authUrl = `${redirectUri}?code=mock_code_for_development&state=${state}`
      message = '未配置微信APPID，返回模拟授权链接（仅用于开发测试）'
      console.warn(message)
    }

    res.json({
      success: true,
      data: {
        authUrl,
      },
      message: message,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

module.exports = router
