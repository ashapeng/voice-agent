const Sentiment = require('./sentiment.js')
const Emotion = require('./emotion.js')

module.exports = {
  // API配置
  apiConfig: {
    baseUrl: 'http://localhost:5000',
    analyzeEndpoint: '/api/analyze'
  },
  
  init() {
    // 初始化分析模块
    Sentiment.init()
    Emotion.init()
    
    // 检查API连接
    this.checkApiConnection()
  },
  
  checkApiConnection() {
    wx.request({
      url: `${this.apiConfig.baseUrl}/api/analyze`,
      method: 'HEAD',
      success: () => {
        console.log('API连接成功')
      },
      fail: (error) => {
        console.error('API连接失败:', error)
        wx.showToast({
          title: 'API连接失败，将使用本地分析',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  
  analyze(text, audioFeatures = null) {
    return new Promise((resolve, reject) => {
      // 尝试使用API分析
      this.analyzeWithApi(text, audioFeatures)
        .then(result => {
          resolve(result)
        })
        .catch(error => {
          console.warn('API分析失败，使用本地分析:', error)
          // 使用本地分析作为后备
          const localResult = this.analyzeLocally(text)
          resolve(localResult)
        })
    })
  },
  
  analyzeWithApi(text, audioFeatures = null) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.apiConfig.baseUrl}${this.apiConfig.analyzeEndpoint}`,
        method: 'POST',
        data: {
          text: text,
          audio_features: audioFeatures
        },
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.data)
          } else {
            reject(new Error(`API返回错误: ${res.statusCode}`))
          }
        },
        fail: (error) => {
          reject(error)
        }
      })
    })
  },
  
  analyzeLocally(text) {
    // 情绪分析
    const mood = Sentiment.analyze(text)
    
    // 语气分析
    const tone = Emotion.detect(text)
    
    // 生成回复建议
    const suggestion = this.generateSuggestion(mood, tone)
    
    return {
      mood,
      tone,
      underlying_meaning: this.detectUnderlyingMeaning(text),
      suggestion
    }
  },
  
  detectUnderlyingMeaning(text) {
    // 简单的意图检测逻辑
    if (text.includes('?') || text.includes('？')) {
      return '询问信息 (80% confidence)'
    } else if (text.includes('谢谢') || text.includes('感谢')) {
      return '表达感谢 (90% confidence)'
    } else if (text.includes('同意') || text.includes('好的')) {
      return '表达同意 (85% confidence)'
    } else {
      return '陈述信息 (70% confidence)'
    }
  },
  
  generateSuggestion(mood, tone) {
    // 根据情绪和语气生成回复建议
    if (mood === 'negative') {
      return '对方情绪消极，建议表达理解并提供帮助'
    } else if (tone === 'angry') {
      return '对方语气愤怒，建议保持冷静并尝试化解矛盾'
    } else if (tone === 'sad') {
      return '对方情绪低落，建议表达关心和支持'
    } else if (tone === 'happy') {
      return '对方心情愉悦，可以分享积极情绪'
    } else {
      return '对方情绪平稳，可以继续当前话题'
    }
  }
}