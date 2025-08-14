@echo off
echo === 智能对话分析助手测试脚本 ===
echo.

REM 检查Python环境
where python >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo 错误: 未找到Python，请安装Python并确保其在PATH中
    exit /b 1
)

REM 检查虚拟环境
if exist "voice-env\Scripts\activate.bat" (
    echo 激活虚拟环境...
    call voice-env\Scripts\activate.bat
) else (
    echo 创建虚拟环境...
    python -m venv voice-env
    call voice-env\Scripts\activate.bat
    
    echo 安装依赖...
    pip install -r requirements.txt
)

echo.
echo === 运行后端测试 ===
python run_tests.py

echo.
echo === 测试完成 ===
echo 如需启动服务器，请运行: python app.py
echo 然后在微信开发者工具中打开miniprogram目录

pause