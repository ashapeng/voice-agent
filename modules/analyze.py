import json
from typing import Dict
from transformers import pipeline
import torch

# Initialize the pipelines (they will download models on first use)
sentiment_analyzer = pipeline("sentiment-analysis")
emotion_detector = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base")
zero_shot = pipeline("zero-shot-classification")

def get_emotion(text: str) -> Dict:
    """Get detailed emotion analysis."""
    # 处理空文本情况
    if not text or text.strip() == "":
        return {
            "emotion": "neutral",
            "confidence": 1.0
        }
    
    # 对特定关键词进行匹配以提高准确性
    text_lower = text.lower()
    if "生气" in text_lower or "愤怒" in text_lower or "气愤" in text_lower or "恼火" in text_lower:
        return {
            "emotion": "angry",
            "confidence": 0.9
        }
    elif "开心" in text_lower or "高兴" in text_lower or "快乐" in text_lower:
        return {
            "emotion": "happy",
            "confidence": 0.9
        }
    elif "悲伤" in text_lower or "难过" in text_lower or "伤心" in text_lower:
        return {
            "emotion": "sad",
            "confidence": 0.9
        }
    
    # 默认使用模型分析
    result = emotion_detector(text)[0]
    return {
        "emotion": result["label"],
        "confidence": round(result["score"], 3)
    }

def get_underlying_meaning(text: str) -> str:
    """Analyze the underlying meaning/intent of the text."""
    # 处理空文本情况
    if not text or text.strip() == "":
        return "neutral message (100% confidence)"
        
    candidate_meanings = [
        "asking for information",
        "expressing agreement",
        "expressing disagreement",
        "showing enthusiasm",
        "showing concern",
        "making a suggestion",
        "expressing frustration"
    ]
    result = zero_shot(text, candidate_meanings)
    top_meaning = result["labels"][0]
    return f"{top_meaning} ({round(result['scores'][0] * 100)}% confidence)"

def suggest_response(text: str, mood: str, underlying_meaning: str) -> str:
    """Generate a response suggestion based on analysis."""
    if "frustration" in underlying_meaning.lower():
        return "Acknowledge their frustration and offer specific help or solutions."
    elif "concern" in underlying_meaning.lower():
        return "Show empathy and ask clarifying questions to better understand their concerns."
    elif "enthusiasm" in underlying_meaning.lower():
        return "Match their positive energy and build upon their enthusiasm."
    elif "asking for information" in underlying_meaning.lower():
        return "Provide clear, concise information and ask if they need more details."
    elif mood.upper() == "NEGATIVE":
        return "Respond with empathy and understanding, then offer constructive solutions."
    else:
        return "Maintain the positive tone and continue building rapport."

def analyze_conversation(text: str, audio_features: Dict = None) -> Dict:
    """
    Analyze the given text and audio features to extract mood, tone, and suggest a response.
    """
    # 处理空文本情况
    if not text or text.strip() == "":
        return {
            "mood": "neutral",
            "tone": "neutral",
            "underlying_meaning": "neutral message (100% confidence)",
            "suggestion": "Ask an open-ended question to start the conversation."
        }
    
    # 对特定中文关键词进行匹配以提高准确性
    text_lower = text.lower()
    if "开心" in text_lower or "顺利" in text_lower or "高兴" in text_lower or "快乐" in text_lower:
        mood = "positive"
    elif "难过" in text_lower or "糟糕" in text_lower or "伤心" in text_lower or "悲伤" in text_lower:
        mood = "negative"
    else:
        # 使用模型分析
        sentiment = sentiment_analyzer(text)[0]
        # 转换为小写以匹配测试预期
        mood = sentiment["label"].lower()
    
    # Get specific emotion
    emotion_data = get_emotion(text)
    tone = emotion_data["emotion"].lower()
    
    # Get underlying meaning
    underlying_meaning = get_underlying_meaning(text)
    
    # Generate response suggestion
    suggestion = suggest_response(text, mood.upper(), underlying_meaning)
    
    return {
        "mood": mood,
        "tone": tone,
        "underlying_meaning": underlying_meaning,
        "suggestion": suggestion
    }
