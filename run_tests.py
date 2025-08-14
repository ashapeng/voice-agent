#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
测试运行脚本
用于运行所有测试用例
"""

import unittest
import sys
import os
import time

def run_all_tests():
    """运行所有测试用例"""
    print("=== 开始运行所有测试 ===")
    start_time = time.time()
    
    # 发现并运行所有测试
    test_loader = unittest.TestLoader()
    test_suite = test_loader.discover('tests', pattern='test_*.py')
    
    # 运行测试
    test_runner = unittest.TextTestRunner(verbosity=2)
    result = test_runner.run(test_suite)
    
    # 打印测试结果摘要
    elapsed_time = time.time() - start_time
    print("\n=== 测试结果摘要 ===")
    print(f"运行时间: {elapsed_time:.2f}秒")
    print(f"运行测试: {result.testsRun}")
    print(f"成功: {result.testsRun - len(result.failures) - len(result.errors)}")
    print(f"失败: {len(result.failures)}")
    print(f"错误: {len(result.errors)}")
    
    # 返回测试是否全部通过
    return len(result.failures) == 0 and len(result.errors) == 0

def test_backend_api():
    """测试后端API"""
    print("\n=== 测试后端API ===")
    
    # 导入并运行API测试脚本
    try:
        from test_backend import run_all_tests as run_api_tests
        api_success = run_api_tests()
        return api_success
    except ImportError:
        print("错误: 无法导入API测试模块")
        return False
    except Exception as e:
        print(f"错误: API测试失败 - {str(e)}")
        return False

if __name__ == "__main__":
    # 运行单元测试
    unit_tests_passed = run_all_tests()
    
    # 运行API测试
    api_tests_passed = test_backend_api()
    
    # 打印最终结果
    print("\n=== 最终测试结果 ===")
    if unit_tests_passed and api_tests_passed:
        print("✓ 所有测试通过！项目可以顺畅运行。")
        sys.exit(0)
    else:
        print("✗ 部分测试失败，请检查上述错误信息。")
        sys.exit(1)