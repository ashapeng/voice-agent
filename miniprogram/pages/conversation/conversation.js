const analyzer = require('../../utils/analyzer.js')

Page({
  data: {
    messages: [],
    currentAnalysis: null
  },
  
  onLoad() {
    // 对话页面加载时自动开始分析
    this.startConversation()
  },
  
  startConversation() {
    // 设置全局对话状态
    getApp().globalData.conversationStarted = true
    
    // 初始化分析器
    analyzer.init()
    
    // 监听新消息
    wx.onSocketMessage(res => {
      this.analyzeMessage(res.data)
    })
  },
  
  analyzeMessage(message) {
    // 调用分析工具
    const analysis = analyzer.analyze(message)
    
    // 更新界面
    this.setData({
      currentAnalysis: analysis,
      messages: [...this.data.messages, {
        content: message,
        analysis
      }]
    })
  }
})