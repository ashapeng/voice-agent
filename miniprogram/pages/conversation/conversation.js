const analyzer = require('../../utils/analyzer.js')

Page({
  data: {
    messages: [],
    currentAnalysis: null,
    inputText: '',
    isRecording: false,
    isAnalyzing: false
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
  },
  
  // 输入框内容变化处理
  onInputChange(e) {
    this.setData({
      inputText: e.detail.value
    })
  },
  
  // 发送文本消息
  sendMessage() {
    const { inputText } = this.data
    if (!inputText.trim()) return
    
    // 添加消息到列表
    this.addMessage(inputText, null)
    
    // 分析消息
    this.analyzeMessage(inputText)
    
    // 清空输入框
    this.setData({
      inputText: ''
    })
  },
  
  // 开始录音
  startRecording() {
    this.setData({ isRecording: true })
    
    const recorderManager = wx.getRecorderManager()
    
    recorderManager.onStart(() => {
      console.log('录音开始')
    })
    
    recorderManager.onStop((res) => {
      console.log('录音结束', res)
      this.setData({ isRecording: false })
      
      // 这里可以添加语音转文本的逻辑
      // 目前仅作为示例，添加一条固定消息
      const mockText = '这是一条语音消息'
      this.addMessage(mockText, null)
      this.analyzeMessage(mockText)
    })
    
    recorderManager.start({
      duration: 60000, // 最长录音时间，单位ms
      sampleRate: 16000, // 采样率
      numberOfChannels: 1, // 录音通道数
      encodeBitRate: 48000, // 编码码率
      format: 'mp3' // 音频格式
    })
  },
  
  // 停止录音
  stopRecording() {
    const recorderManager = wx.getRecorderManager()
    recorderManager.stop()
  },
  
  // 添加消息到列表
  addMessage(content, analysis) {
    const { messages } = this.data
    
    this.setData({
      messages: [...messages, {
        content,
        analysis,
        time: new Date().toLocaleTimeString()
      }]
    })
  },
  
  // 分析消息
  analyzeMessage(message) {
    this.setData({ isAnalyzing: true })
    
    analyzer.analyze(message)
      .then(analysis => {
        // 更新最后一条消息的分析结果
        const { messages } = this.data
        const lastIndex = messages.length - 1
        
        if (lastIndex >= 0) {
          const updatedMessages = [...messages]
          updatedMessages[lastIndex].analysis = analysis
          
          this.setData({
            currentAnalysis: analysis,
            messages: updatedMessages,
            isAnalyzing: false
          })
        }
      })
      .catch(error => {
        console.error('分析失败:', error)
        this.setData({ isAnalyzing: false })
        
        wx.showToast({
          title: '分析失败',
          icon: 'none'
        })
      })
  }
})