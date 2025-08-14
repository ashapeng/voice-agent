// 微信小程序测试模块
// 用于测试小程序核心功能

const sentiment = require('./utils/sentiment.js');
const emotion = require('./utils/emotion.js');
const analyzer = require('./utils/analyzer.js');

/**
 * 测试工具类
 */
const TestUtil = {
  /**
   * 运行测试用例
   * @param {string} name - 测试名称
   * @param {Function} testFn - 测试函数
   */
  runTest(name, testFn) {
    try {
      console.log(`\n开始测试: ${name}`);
      const result = testFn();
      console.log(`✓ 测试通过: ${name}`);
      return result;
    } catch (error) {
      console.error(`✗ 测试失败: ${name}`);
      console.error(`  错误信息: ${error.message}`);
      return false;
    }
  },

  /**
   * 断言条件为真
   * @param {boolean} condition - 条件
   * @param {string} message - 错误消息
   */
  assert(condition, message) {
    if (!condition) {
      throw new Error(message || '断言失败');
    }
  },

  /**
   * 断言两个值相等
   * @param {*} actual - 实际值
   * @param {*} expected - 期望值
   * @param {string} message - 错误消息
   */
  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(message || `期望 ${expected}，但得到 ${actual}`);
    }
  },

  /**
   * 断言对象包含特定属性
   * @param {Object} obj - 对象
   * @param {Array<string>} props - 属性列表
   * @param {string} message - 错误消息
   */
  assertHasProps(obj, props, message) {
    for (const prop of props) {
      if (!(prop in obj)) {
        throw new Error(message || `对象缺少属性: ${prop}`);
      }
    }
  }
};

/**
 * 测试情感分析模块
 */
function testSentimentModule() {
  // 测试模块初始化
  sentiment.init();
  console.log('  情感分析模块初始化成功');

  // 测试积极文本
  const positiveText = '今天真是太开心了，一切都很顺利！';
  const positiveResult = sentiment.analyze(positiveText);
  TestUtil.assertEqual(positiveResult, 'positive', '积极文本分析失败');
  console.log(`  积极文本分析结果: ${positiveResult}`);

  // 测试消极文本
  const negativeText = '我很难过，事情变得很糟糕';
  const negativeResult = sentiment.analyze(negativeText);
  TestUtil.assertEqual(negativeResult, 'negative', '消极文本分析失败');
  console.log(`  消极文本分析结果: ${negativeResult}`);

  // 测试中性文本
  const neutralText = '今天是星期三';
  const neutralResult = sentiment.analyze(neutralText);
  TestUtil.assertEqual(neutralResult, 'neutral', '中性文本分析失败');
  console.log(`  中性文本分析结果: ${neutralResult}`);

  return true;
}

/**
 * 测试情绪检测模块
 */
function testEmotionModule() {
  // 测试模块初始化
  emotion.init();
  console.log('  情绪检测模块初始化成功');

  // 测试不同情绪文本
  const testCases = [
    { text: '我太生气了，简直难以置信！', expected: 'angry' },
    { text: '我今天特别开心，一切都很美好！', expected: 'happy' },
    { text: '我感到非常悲伤和失落', expected: 'sad' },
    { text: '这太令人惊讶了，我没想到会这样', expected: 'surprised' },
    { text: '我对这件事没什么特别的感觉', expected: 'neutral' }
  ];

  for (const testCase of testCases) {
    const result = emotion.detect(testCase.text);
    TestUtil.assertEqual(result, testCase.expected, `情绪检测失败: ${testCase.text}`);
    console.log(`  文本 "${testCase.text.substring(0, 10)}..." 情绪检测结果: ${result}`);
  }

  return true;
}

/**
 * 测试分析器模块
 */
function testAnalyzerModule() {
  // 测试模块初始化
  analyzer.init();
  console.log('  分析器模块初始化成功');

  // 测试本地分析功能
  const text = '我今天心情很好，谢谢你的帮助！';
  const result = analyzer.analyzeLocally(text);
  
  // 验证结果结构
  TestUtil.assertHasProps(result, ['mood', 'tone', 'suggestion', 'underlying_meaning'], '分析结果缺少必要属性');
  console.log('  分析结果包含所有必要属性');
  
  // 验证结果内容
  TestUtil.assertEqual(result.mood, 'positive', '情绪分析结果不正确');
  console.log(`  情绪分析结果: ${result.mood}`);
  console.log(`  语气分析结果: ${result.tone}`);
  console.log(`  潜在意图: ${result.underlying_meaning}`);
  console.log(`  建议回复: ${result.suggestion}`);

  return true;
}

/**
 * 运行所有测试
 */
function runAllTests() {
  console.log('=== 开始前端模块测试 ===');
  
  const sentimentTestPassed = TestUtil.runTest('情感分析模块', testSentimentModule);
  const emotionTestPassed = TestUtil.runTest('情绪检测模块', testEmotionModule);
  const analyzerTestPassed = TestUtil.runTest('分析器模块', testAnalyzerModule);
  
  console.log('\n=== 测试结果摘要 ===');
  if (sentimentTestPassed && emotionTestPassed && analyzerTestPassed) {
    console.log('✓ 所有测试通过！前端模块正常运行。');
  } else {
    console.log('✗ 部分测试失败，请检查上述错误信息。');
  }
}

// 导出测试函数，供小程序调用
module.exports = {
  runAllTests
};