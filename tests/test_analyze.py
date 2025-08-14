"""
后端分析模块测试
用于测试analyze.py模块的功能
"""

import unittest
import sys
import os

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from modules.analyze import analyze_conversation

class TestAnalyzeModule(unittest.TestCase):
    """测试分析模块的功能"""
    
    def test_analyze_positive_text(self):
        """测试积极文本分析"""
        text = "今天真是太开心了，一切都很顺利！"
        result = analyze_conversation(text)
        
        # 验证结果结构
        self.assertIn('mood', result)
        self.assertIn('tone', result)
        self.assertIn('suggestion', result)
        
        # 验证情感分析结果
        self.assertEqual(result['mood'], 'positive')
        
    def test_analyze_negative_text(self):
        """测试消极文本分析"""
        text = "我很难过，事情变得很糟糕"
        result = analyze_conversation(text)
        
        # 验证情感分析结果
        self.assertEqual(result['mood'], 'negative')
    
    def test_analyze_angry_text(self):
        """测试愤怒文本分析"""
        text = "我太生气了，简直难以置信！"
        result = analyze_conversation(text)
        
        # 验证语气分析结果
        self.assertEqual(result['tone'], 'angry')
    
    def test_analyze_with_audio_features(self):
        """测试带有音频特征的分析"""
        text = "这是一段普通的文本"
        audio_features = {
            'pitch': 220,
            'volume': 0.8,
            'speed': 1.2
        }
        
        result = analyze_conversation(text, audio_features)
        
        # 验证结果结构
        self.assertIn('mood', result)
        self.assertIn('tone', result)
        self.assertIn('suggestion', result)
        
    def test_analyze_empty_text(self):
        """测试空文本分析"""
        text = ""
        result = analyze_conversation(text)
        
        # 验证结果结构
        self.assertIn('mood', result)
        self.assertIn('tone', result)
        self.assertIn('suggestion', result)
        
        # 空文本应该返回中性情绪
        self.assertEqual(result['mood'], 'neutral')

if __name__ == '__main__':
    unittest.main()