/**
 * 情绪检测模块
 * 负责分析文本的具体情绪类型（如愤怒、喜悦、悲伤等）
 */

module.exports = {
  // 情绪检测模型状态
  model: null,
  
  /**
   * 初始化情绪检测模块
   */
  init() {
    // 在实际应用中，这里可能会加载模型或预处理数据
    console.log('情绪检测模块初始化')
  },
  
  /**
   * 检测文本情绪
   * @param {string} text - 需要分析的文本
   * @return {string} - 情绪分析结果：angry/happy/sad/surprised/fearful/disgusted/neutral
   */
  detect(text) {
    // 调用后端API
    const result = this.callEmotionApi(text)
    
    return result || this.simpleDetect(text)
  },
  
  /**
   * 调用后端情绪分析API
   * @param {string} text - 需要分析的文本
   * @return {string|null} - API返回的情绪分析结果，失败时返回null
   */
  callEmotionApi(text) {
    // 同步调用API的简化实现
    try {
      // 实际应用中应该使用wx.request进行异步请求
      return null // 这里返回null，使用本地分析作为后备
    } catch (error) {
      console.error('API调用失败:', error)
      return null
    }
  },
  
  /**
   * 简单的本地情绪检测（作为API的后备）
   * @param {string} text - 需要分析的文本
   * @return {string} - 情绪分析结果
   */
  simpleDetect(text) {
    // 情绪关键词映射
    const emotionKeywords = {
      angry: ['生气', '愤怒', '恼火', '烦躁', '不爽', '火大', '气死'],
      happy: ['开心', '高兴', '快乐', '兴奋', '喜悦', '欣喜', '欢乐'],
      sad: ['难过', '伤心', '悲伤', '痛苦', '忧伤', '沮丧', '失落'],
      surprised: ['惊讶', '震惊', '意外', '吃惊', '没想到', '不可思议'],
      fearful: ['害怕', '恐惧', '担心', '忧虑', '紧张', '惊恐'],
      disgusted: ['恶心', '讨厌', '厌恶', '反感', '嫌弃'],
      neutral: ['一般', '还行', '正常', '普通']
    }
    
    // 计算每种情绪的匹配分数
    const scores = {}
    
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      scores[emotion] = 0
      
      keywords.forEach(keyword => {
        const regex = new RegExp(keyword, 'g')
        const matches = text.match(regex)
        if (matches) {
          scores[emotion] += matches.length
        }
      })
    }
    
    // 找出得分最高的情绪
    let maxScore = 0
    let detectedEmotion = 'neutral' // 默认为中性
    
    for (const [emotion, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score
        detectedEmotion = emotion
      }
    }
    
    return detectedEmotion
  }
}