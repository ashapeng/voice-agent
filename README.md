<div align="center">
  <h1>Voice Agent<br> 智能对话分析助手（微信小程序版）</h1>
</div>

## 项目概述
本项目是一个基于 Flask 和 Transformers 的实时对话分析工具。它能够分析对话内容（文本、语气语调等），解析对方的意图和深层含义，并提供智能响应建议。特别适合用于微信聊天场景，帮助用户更好地理解对话内容和对方情绪。

## 技术栈
- **前端**：微信小程序原生开发
- **后端**：Flask + Flask-CORS（提供 `/api/analyze` 接口）
- **核心分析模块**：Python（情绪、意图分析和响应建议）
- **自然语言处理**：Transformers（Hugging Face）
- **深度学习**：PyTorch
- **生产部署**：Waitress WSGI服务器
- **依赖管理**：Python 3.x

## 项目结构
```
voice-agent/
├── app.py                  # 后端API服务入口
├── modules/
│   └── analyze.py          # 核心分析模块
├── requirements.txt        # 项目依赖包列表
├── .env                    # 环境配置文件
└── miniprogram/            # 微信小程序源代码
    ├── app.js              # 小程序入口文件
    ├── app.json            # 小程序配置文件
    ├── project.config.json # 项目配置文件
    ├── sitemap.json        # 站点地图配置
    ├── pages/              # 小程序页面
    │   ├── index/          # 首页
    │   └── conversation/   # 对话分析页
    └── utils/              # 工具模块
        ├── analyzer.js     # 分析工具主模块
        ├── sentiment.js    # 情感分析模块
        └── emotion.js      # 情绪检测模块
```

## 功能特点
- **实时情绪分析**：分析对话中的情绪状态（积极/消极）
- **语气识别**：识别说话的语气（愤怒/开心/悲伤等）
- **意图解析**：理解对话的潜在意图和深层含义
- **智能回复建议**：根据分析结果提供合适的回复建议
- **语音输入支持**：支持语音输入进行分析（基础功能）
- **离线分析能力**：当API不可用时，提供基本的本地分析能力

## 使用方法

### 后端服务
1. 安装依赖：
   ```bash
   pip install -r requirements.txt
   ```

2. 开发环境启动：
   ```bash
   python app.py
   ```
   服务将在 http://localhost:5000 上运行

3. 生产环境启动：
   ```bash
   # 修改.env文件中的PRODUCTION=true
   python app.py
   ```

### 微信小程序
1. 在微信开发者工具中导入`miniprogram/`目录
2. 修改`miniprogram/utils/analyzer.js`中的API配置：
   ```javascript
   apiConfig: {
     baseUrl: 'http://your-server-address:5000',
     analyzeEndpoint: '/api/analyze'
   }
   ```
3. 配置微信开发者工具中的"不校验合法域名"选项（开发阶段）
4. 编译运行小程序

## API接口
- **POST /api/analyze**：分析对话内容
  - 请求体：`{ "text": "要分析的文本", "audio_features": null }`
  - 响应：`{ "mood": "情绪", "tone": "语气", "underlying_meaning": "潜在意图", "suggestion": "回复建议" }`

- **GET /api/status**：检查API状态
  - 响应：`{ "status": "ok", "version": "1.0.0" }`

## 扩展计划
- **音频特征分析**：结合语音特征（语调、语速等）进一步优化情绪检测
- **多语言支持**：扩展为支持多种语言的分析
- **对话历史分析**：基于历史对话进行更深入的关系分析
- **个性化建议**：根据用户习惯提供个性化的回复建议

## 注意事项
- 本项目仅支持微信小程序，不提供网页版
- 首次使用时会下载预训练模型，可能需要一些时间
- 生产环境部署时，请确保服务器有足够的内存运行模型

## 贡献
欢迎提交 Issue 或 Pull Request 改进本项目！
