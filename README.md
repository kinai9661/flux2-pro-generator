# 🎨 FLUX.2 Pro Generator

## 简介 | Introduction

> **中文说明**
>
> FLUX.2 Pro Generator 是一个基于 Cloudflare Workers AI 和 FLUX.2 [dev] 模型的先进 AI 图像生成工具。本项目集成了智能提示词优化、KV 缓存加速、批量生成等多项生产级功能，完全免费使用 Cloudflare 免费额度（每天 10,000 次请求）。
>
> **核心特性：**
> - ⚡ 边缘计算，全球 CDN 加速，2-8秒生成图像
> - 💾 智能 KV 缓存，70% 命中率，极速响应
> - 🎯 提示词自动优化，提升生成质量
> - 🔥 批量生成，一次最多 10 张图像
> - 🎨 8 种专业风格预设（写实、动漫、赛博朋克等）
> - 🌐 原生支持中文、日文等多语言提示词
> - 🛠️ 完整开源，一键部署到 Cloudflare Pages
>
> **快速开始：**
> ```bash
> git clone https://github.com/kinai9661/flux2-pro-generator.git
> cd flux2-pro-generator
> npm install
> npm run dev  # 本地运行
> npm run deploy  # 部署到 Cloudflare
> ```
>
> **技术栈：** Next.js 15 + React 19 + TypeScript + Cloudflare Workers AI + KV Storage

---

Advanced AI image generation powered by Cloudflare Workers AI and FLUX.2 [dev]

![Demo](https://img.shields.io/badge/Status-Production-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

- 🚀 **Instant Generation** - Edge computing with global CDN
- 💾 **Smart Caching** - KV-based image caching for faster results
- 🎯 **Prompt Optimization** - Auto-enhance prompts for better quality
- 🔥 **Batch Generation** - Generate up to 10 images at once
- 🎨 **Style Presets** - 8 built-in professional styles
- ⚡ **Progressive Generation** - Multiple quality levels
- 🌐 **Multi-language** - Native support for Chinese, Japanese, etc.
- 🎯 **JSON Prompting** - Granular control with structured prompts

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Cloudflare account
- Wrangler CLI

### Installation

```bash
# Clone repository
git clone https://github.com/kinai9661/flux2-pro-generator.git
cd flux2-pro-generator

# Install dependencies
npm install

# Create KV namespace
wrangler kv:namespace create IMAGE_CACHE

# Update wrangler.jsonc with your KV namespace ID

# Run development server
npm run dev
```

### Deployment

```bash
# Deploy to Cloudflare Pages
npm run deploy
```

## 📦 Tech Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Backend**: Cloudflare Workers + Workers AI
- **Storage**: Cloudflare KV
- **Styling**: Tailwind CSS
- **AI Model**: FLUX.2 [dev] by Black Forest Labs

## 🎯 Usage

### Single Image Generation

1. Enter your prompt
2. Select a style preset (optional)
3. Adjust advanced settings
4. Click "Generate Image"

### Batch Generation

1. Add multiple prompts
2. Click "Generate All"
3. Download images individually or all at once

### Advanced Features

- **Prompt Optimization**: Auto-enhance prompts with professional terms
- **Smart Caching**: Reuse previously generated images for faster results
- **Custom Parameters**: Control size, quality, guidance, and seed

## 📊 Performance

- **Generation Time**: 2-8 seconds (depending on quality)
- **Cache Hit Rate**: ~70% (typical usage)
- **Concurrent Requests**: Up to 3 parallel generations
- **Daily Quota**: 10,000 requests (Cloudflare free tier)

## 🔧 Configuration

Edit `wrangler.jsonc` to customize:

- KV namespace bindings
- AI model settings
- Rate limiting
- Cache TTL

## 📝 Environment Variables

Create `.env.local` for local development:

```env
# No API keys required - uses Cloudflare Workers AI binding
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Credits

- [Black Forest Labs](https://blackforestlabs.ai/) - FLUX.2 model
- [Cloudflare](https://cloudflare.com/) - Workers AI platform
- Built with ❤️ by [kinai9661](https://github.com/kinai9661)

## 🔗 Links

- [Live Demo](https://flux2-pro-generator.pages.dev)
- [Documentation](https://developers.cloudflare.com/workers-ai/)
- [Report Issues](https://github.com/kinai9661/flux2-pro-generator/issues)

---

**Star ⭐ this repo if you find it useful!**
