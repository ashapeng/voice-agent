Page({
  data: {
    // 页面数据
  },
  
  onLoad() {
    // 页面加载时执行
    this.checkApiConnection()
  },
  
  checkApiConnection() {
    // 检查API连接状态
    wx.request({
      url: 'https://your-api-domain.com/api/status',
      method: 'GET',
      success: () => {
        // API连接正常
        this.setData({
          apiConnected: true
        })
      },
      fail: () => {
        // API连接失败
        wx.showToast({
          title: 'API连接失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  
  startAnalysis() {
    // 跳转到对话分析页面
    wx.navigateTo({
      url: '/pages/conversation/conversation'
    })
  },
  
  // 跳转到测试页面
  goToTest() {
    wx.navigateTo({
      url: '/pages/test/test'
    })
  }
})