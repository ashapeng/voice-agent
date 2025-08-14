<div align="center">
  <h1>Voice Agent<br> 智能对话分析助手（微信小程序版）</h1>
</div>

## 项目概述
本项目是一个基于 Flask 和 Transformers 的实时对话分析工具，由 Vibe Coding 生成。它能够分析对话内容（文本、语气语调等），解析对方的意图和深层含义，并提供智能响应建议。

## 技术栈
- **前端**：微信小程序原生开发
- **后端**：Flask（提供 `/api/analyze` 接口）
- **核心分析模块**：Python（情绪、意图分析和响应建议）
- **自然语言处理**：Transformers（Hugging Face）
- **深度学习**：PyTorch
- **依赖管理**：Python 3.x

## 项目结构
```
voice-agent/
├── app.py                  # 后端API服务入口（仅提供 `/api/analyze` 接口）
├── modules/
│   └── analyze.py          # 核心分析模块
├── requirements.txt        # 项目依赖包列表
└── miniprogram/            # 微信小程序源代码
    ├── app.js              # 小程序入口文件
    ├── pages/              # 小程序页面
    │   └── conversation/   # 对话分析页
    └── utils/              # 工具模块（如分析逻辑）
```

## 使用方法
1. **后端服务**：
   - 安装依赖：`pip install -r requirements.txt`
   - 启动服务：`python app.py`
2. **微信小程序**：
   - 在微信开发者工具中导入 `miniprogram/` 目录
   - 配置合法域名（指向后端API）
   - 编译并测试功能

## 注意事项
- 本项目已移除所有网页版相关内容，仅支持微信小程序。

## 使用方法
1. 安装依赖：
   ```bash
   pip install -r requirements.txt
   ```
2. 启动服务：
   ```bash
   python app.py
   ```
3. 访问 `http://localhost:5000` 使用工具。

## 扩展性
- 支持结合音频特征（如语调分析）进一步优化情绪检测。
- 可扩展为多语言支持或集成更多 NLP 模型。

## 贡献
欢迎提交 Issue 或 Pull Request 改进本项目！
