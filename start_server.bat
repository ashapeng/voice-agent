@echo off
echo === 启动智能对话分析助手API服务 ===

REM 检查Python环境
where python >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo 错误: 未找到Python，请确保Python已安装并添加到PATH中
    exit /b 1
)

REM 检查是否已激活虚拟环境
if "%VIRTUAL_ENV%"=="" (
    echo 警告: 未检测到虚拟环境，建议在虚拟环境中运行
    echo 如需创建虚拟环境，请运行: python -m venv voice-env
    echo 然后激活环境: voice-env\Scripts\activate
    echo.
    echo 按任意键继续不使用虚拟环境...
    pause >nul
)

REM 启动服务器
echo 正在启动API服务器...
start /B python app.py

REM 等待服务器启动
echo 等待服务器启动...
timeout /t 3 /nobreak >nul

REM 检查服务器是否成功启动
curl -s http://localhost:5000/api/status >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo 服务器启动成功！
    echo API服务运行在: http://localhost:5000
    echo 首页访问地址: http://localhost:5000
    echo.
    echo 按Ctrl+C可以停止服务器
) else (
    echo 警告: 服务器可能未成功启动，请检查控制台输出
)

echo.
echo 服务器正在后台运行...