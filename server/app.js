var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var wechatRouter = require('./routes/wechat')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
// app.use(express.static('/Users/admin/Desktop/taoerchang-vue3-h5/dist'))
app.use(express.static(path.join(__dirname, '../dist')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/api/wechat', wechatRouter)

// 为SPA应用添加路由支持，所有未匹配的路由都重定向到index.html
app.get('*', function (req, res, next) {
  // 检查请求是否接受HTML响应
  if (req.accepts('html')) {
    // 直接发送index.html文件
    res.sendFile(path.join(__dirname, '../dist/index.html'))
    return
  }
  // 对于非HTML请求，继续404处理
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
