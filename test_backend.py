#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
后端API测试脚本
用于测试Flask API服务是否正常运行
"""

import requests
import json
import time
import sys
import os
import subprocess
import signal
import atexit
import platform

# 测试配置
API_BASE_URL = "http://localhost:5000"
TEST_TEXT = "我今天心情很好，谢谢你的帮助！"
SERVER_PROCESS = None

def print_colored(text, color):
    """打印彩色文本"""
    colors = {
        "green": "\033[92m",
        "red": "\033[91m",
        "yellow": "\033[93m",
        "blue": "\033[94m",
        "end": "\033[0m"
    }
    print(f"{colors.get(color, '')}{text}{colors['end']}")

def start_server():
    """启动API服务器"""
    global SERVER_PROCESS
    
    print("启动API服务器...")
    
    # 确定Python解释器路径
    python_cmd = sys.executable
    
    # 确定app.py的路径
    app_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "app.py")
    
    # 启动服务器进程
    if platform.system() == "Windows":
        SERVER_PROCESS = subprocess.Popen(
            [python_cmd, app_path],
            creationflags=subprocess.CREATE_NEW_CONSOLE
        )
    else:
        SERVER_PROCESS = subprocess.Popen(
            [python_cmd, app_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
    
    # 注册退出时关闭服务器
    atexit.register(stop_server)
    
    # 等待服务器启动
    print("等待服务器启动...")
    for _ in range(20):  # 增加尝试次数
        try:
            requests.get(f"{API_BASE_URL}/", timeout=2)  # 增加超时时间
            print_colored("✓ 服务器已启动", "green")
            return True
        except requests.exceptions.ConnectionError:
            time.sleep(1)
        except Exception as e:
            print(f"等待过程中出错: {str(e)}")
            time.sleep(1)
    
    print_colored("✗ 服务器启动超时", "red")
    return False

def stop_server():
    """停止API服务器"""
    global SERVER_PROCESS
    if SERVER_PROCESS:
        print("关闭API服务器...")
        if platform.system() == "Windows":
            # Windows下使用taskkill强制终止进程
            subprocess.call(['taskkill', '/F', '/T', '/PID', str(SERVER_PROCESS.pid)])
        else:
            # Linux/Mac下使用kill信号
            os.kill(SERVER_PROCESS.pid, signal.SIGTERM)
        SERVER_PROCESS = None

def test_api_status():
    """测试API状态端点"""
    print("\n测试API状态...")
    try:
        response = requests.get(f"{API_BASE_URL}/api/status", timeout=5)
        if response.status_code == 200:
            print_colored("✓ API状态检查通过", "green")
            print(f"  状态: {response.json().get('status')}")
            print(f"  版本: {response.json().get('version')}")
            return True
        else:
            print_colored(f"✗ API状态检查失败: HTTP {response.status_code}", "red")
            return False
    except requests.exceptions.ConnectionError:
        print_colored("✗ 无法连接到API服务器，请确保服务器已启动", "red")
        return False
    except Exception as e:
        print_colored(f"✗ 测试API状态时出错: {str(e)}", "red")
        return False

def test_analyze_endpoint():
    """测试分析端点"""
    print("\n测试文本分析功能...")
    try:
        payload = {
            "text": TEST_TEXT,
            "audio_features": None
        }
        
        print(f"  发送文本: '{TEST_TEXT}'")
        start_time = time.time()
        
        response = requests.post(
            f"{API_BASE_URL}/api/analyze", 
            json=payload,
            timeout=10
        )
        
        elapsed_time = time.time() - start_time
        
        if response.status_code == 200:
            result = response.json()
            print_colored("✓ 分析请求成功", "green")
            print(f"  响应时间: {elapsed_time:.2f}秒")
            print("\n分析结果:")
            print(f"  情绪: {result.get('mood', 'N/A')}")
            print(f"  语气: {result.get('tone', 'N/A')}")
            print(f"  潜在意图: {result.get('underlying_meaning', 'N/A')}")
            print(f"  建议回复: {result.get('suggestion', 'N/A')}")
            return True
        else:
            print_colored(f"✗ 分析请求失败: HTTP {response.status_code}", "red")
            print(f"  错误信息: {response.text}")
            return False
    except requests.exceptions.ConnectionError:
        print_colored("✗ 无法连接到API服务器，请确保服务器已启动", "red")
        return False
    except Exception as e:
        print_colored(f"✗ 测试分析端点时出错: {str(e)}", "red")
        return False

def run_all_tests():
    """运行所有测试"""
    print_colored("=== 开始后端API测试 ===", "blue")
    
    # 启动服务器
    if not start_server():
        print_colored("\n⚠ 无法启动API服务器，跳过测试", "yellow")
        return False
    
    # 等待服务器完全启动
    time.sleep(3)
    
    status_ok = test_api_status()
    if not status_ok:
        print_colored("\n⚠ API状态测试失败，跳过后续测试", "yellow")
        return False
    
    analyze_ok = test_analyze_endpoint()
    
    print("\n测试结果:")
    if status_ok and analyze_ok:
        print_colored("✓ 所有API测试通过", "green")
        return True
    else:
        print_colored("✗ 部分API测试失败", "red")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)