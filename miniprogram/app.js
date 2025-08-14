App({
  onLaunch() {
    // 初始化云开发
    wx.cloud.init({
      env: 'production-env-id',
      traceUser: true
    })
    
    // 检查登录状态
    this.checkLogin()
  },
  
  checkLogin() {
    // 检查用户是否已登录
    wx.checkSession({
      success() {},
      fail() {
        // 重新登录
        this.login()
      }
    })
  },
  
  login() {
    // 微信登录
    wx.login({
      success: res => {
        // 发送code到后端
        wx.request({
          url: 'https://your-api-domain.com/login',
          data: { code: res.code },
          success: res => {
            // 存储登录态
            wx.setStorageSync('session', res.data.session)
          }
        })
      }
    })
  },
  
  globalData: {
    // 全局共享数据
    conversationStarted: false,
    currentAnalysis: null
  }
})