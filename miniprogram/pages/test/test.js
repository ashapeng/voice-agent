const testModule = require('../../utils/test.js');
const analyzer = require('../../utils/analyzer.js');
const sentiment = require('../../utils/sentiment.js');
const emotion = require('../../utils/emotion.js');

Page({
  data: {
    testText: '我今天心情很好，谢谢你的帮助！',
    testResults: [],
    apiBaseUrl: 'http://localhost:5000'
  },
  
  onLoad() {
    // 页面加载时执行
  },
  
  // 输入框内容变化处理
  onInputChange(e) {
    this.setData({
      testText: e.detail.value
    });
  },
  
  // 测试前端模块
  testFrontend() {
    this.addResult({
      title: '开始前端模块测试',
      message: '正在测试所有前端模块...',
      success: true
    });
    
    try {
      // 运行测试并捕获控制台输出
      const originalConsoleLog = console.log;
      const originalConsoleError = console.error;
      
      let logs = [];
      console.log = (...args) => {
        logs.push(args.join(' '));
        originalConsoleLog.apply(console, args);
      };
      
      console.error = (...args) => {
        logs.push('错误: ' + args.join(' '));
        originalConsoleError.apply(console, args);
      };
      
      // 执行测试
      testModule.runAllTests();
      
      // 恢复控制台函数
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      
      // 检查测试结果
      const success = !logs.some(log => log.includes('测试失败') || log.includes('错误:'));
      
      this.addResult({
        title: '前端模块测试完成',
        message: success ? '所有测试通过！' : '部分测试失败',
        details: logs,
        success: success
      });
    } catch (error) {
      this.addResult({
        title: '前端模块测试失败',
        message: error.message,
        success: false
      });
    }
  },
  
  // 测试情感分析
  testSentiment() {
    const { testText } = this.data;
    
    try {
      sentiment.init();
      const result = sentiment.analyze(testText);
      
      this.addResult({
        title: '情感分析测试',
        message: `文本 "${testText}" 的情感分析结果: ${result}`,
        success: true
      });
    } catch (error) {
      this.addResult({
        title: '情感分析测试失败',
        message: error.message,
        success: false
      });
    }
  },
  
  // 测试情绪检测
  testEmotion() {
    const { testText } = this.data;
    
    try {
      emotion.init();
      const result = emotion.detect(testText);
      
      this.addResult({
        title: '情绪检测测试',
        message: `文本 "${testText}" 的情绪检测结果: ${result}`,
        success: true
      });
    } catch (error) {
      this.addResult({
        title: '情绪检测测试失败',
        message: error.message,
        success: false
      });
    }
  },
  
  // 测试API连接
  testApiConnection() {
    const { apiBaseUrl } = this.data;
    
    this.addResult({
      title: '测试API连接',
      message: `正在连接 ${apiBaseUrl}/api/status...`,
      success: true
    });
    
    wx.request({
      url: `${apiBaseUrl}/api/status`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          this.addResult({
            title: 'API连接成功',
            message: `状态: ${res.data.status}, 版本: ${res.data.version}`,
            success: true
          });
        } else {
          this.addResult({
            title: 'API连接失败',
            message: `HTTP状态码: ${res.statusCode}`,
            success: false
          });
        }
      },
      fail: (error) => {
        this.addResult({
          title: 'API连接失败',
          message: `错误: ${error.errMsg}`,
          details: ['请确保后端服务器已启动', `API地址: ${apiBaseUrl}`],
          success: false
        });
      }
    });
  },
  
  // 测试分析功能
  testApiAnalyze() {
    const { apiBaseUrl, testText } = this.data;
    
    this.addResult({
      title: '测试API分析功能',
      message: `正在发送文本: "${testText}"`,
      success: true
    });
    
    wx.request({
      url: `${apiBaseUrl}/api/analyze`,
      method: 'POST',
      data: {
        text: testText,
        audio_features: null
      },
      success: (res) => {
        if (res.statusCode === 200) {
          const result = res.data;
          this.addResult({
            title: 'API分析成功',
            message: '分析结果:',
            details: [
              `情绪: ${result.mood || 'N/A'}`,
              `语气: ${result.tone || 'N/A'}`,
              `潜在意图: ${result.underlying_meaning || 'N/A'}`,
              `建议回复: ${result.suggestion || 'N/A'}`
            ],
            success: true
          });
        } else {
          this.addResult({
            title: 'API分析失败',
            message: `HTTP状态码: ${res.statusCode}`,
            details: [res.data.error || '未知错误'],
            success: false
          });
        }
      },
      fail: (error) => {
        this.addResult({
          title: 'API分析请求失败',
          message: `错误: ${error.errMsg}`,
          details: ['请确保后端服务器已启动', `API地址: ${apiBaseUrl}/api/analyze`],
          success: false
        });
      }
    });
  },
  
  // 完整流程测试
  testFullFlow() {
    const { testText } = this.data;
    
    this.addResult({
      title: '开始完整流程测试',
      message: '测试前端分析和API分析的一致性',
      success: true
    });
    
    // 本地分析
    try {
      analyzer.init();
      const localResult = analyzer.analyzeLocally(testText);
      
      this.addResult({
        title: '本地分析完成',
        message: '本地分析结果:',
        details: [
          `情绪: ${localResult.mood}`,
          `语气: ${localResult.tone}`,
          `潜在意图: ${localResult.underlying_meaning}`,
          `建议回复: ${localResult.suggestion}`
        ],
        success: true
      });
      
      // API分析
      analyzer.analyze(testText)
        .then(apiResult => {
          this.addResult({
            title: 'API分析完成',
            message: 'API分析结果:',
            details: [
              `情绪: ${apiResult.mood}`,
              `语气: ${apiResult.tone}`,
              `潜在意图: ${apiResult.underlying_meaning}`,
              `建议回复: ${apiResult.suggestion}`
            ],
            success: true
          });
          
          // 比较结果
          const consistent = 
            apiResult.mood === localResult.mood || 
            apiResult.tone === localResult.tone;
          
          this.addResult({
            title: '结果一致性检查',
            message: consistent ? '本地分析和API分析结果一致' : '本地分析和API分析结果不一致',
            success: consistent
          });
        })
        .catch(error => {
          this.addResult({
            title: 'API分析失败',
            message: `错误: ${error.message || error}`,
            details: ['使用本地分析作为后备'],
            success: false
          });
        });
    } catch (error) {
      this.addResult({
        title: '完整流程测试失败',
        message: error.message,
        success: false
      });
    }
  },
  
  // 添加测试结果
  addResult(result) {
    const { testResults } = this.data;
    this.setData({
      testResults: [result, ...testResults]
    });
  },
  
  // 清除结果
  clearResults() {
    this.setData({
      testResults: []
    });
  },
  
  // 返回首页
  navigateBack() {
    wx.navigateBack({
      delta: 1
    });
  }
});