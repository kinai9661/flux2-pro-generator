# 🎨 FLUX.2 Pro Generator

<div align="center">

![FLUX.2 Pro Generator](https://img.shields.io/badge/FLUX.2-Pro_Generator-blueviolet?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkw0IDdWMTdMMTIgMjJMMjAgMTdWN0wxMiAyWiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+)

![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=flat-square&logo=next.js)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers_AI-orange?style=flat-square&logo=cloudflare)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)

**基于 Cloudflare Workers AI 和 FLUX.2 [dev] 的企业级 AI 图像生成平台**

[🚀 在线体验](https://flux2-pro-generator.pages.dev) • [📖 文档](./DEPLOYMENT.md) • [🐛 反馈问题](https://github.com/kinai9661/flux2-pro-generator/issues) • [⭐ Star](https://github.com/kinai9661/flux2-pro-generator)

</div>

---

## 🌟 项目亮点

<table>
<tr>
<td width="50%">

### ⚡ 极速生成
- **2-8秒** 生成高质量图像
- **边缘计算** 全球 300+ 节点
- **零冷启动** 即时响应
- **70%+ 缓存命中率** 极速复用

</td>
<td width="50%">

### 🎯 智能优化
- **AI 提示词增强** 自动优化
- **8种专业风格** 预设模板
- **多语言支持** 中文/日文等
- **批量生成** 最多10张并行

</td>
</tr>
<tr>
<td width="50%">

### 💾 企业级架构
- **KV 智能缓存** 7天持久化
- **速率限制** 防滥用保护
- **错误恢复** 完整容错机制
- **性能监控** 实时分析

</td>
<td width="50%">

### 🆓 完全免费
- **10,000 请求/天** Cloudflare 免费额度
- **无需 API Key** 开箱即用
- **开源项目** MIT 协议
- **一键部署** 5分钟上线

</td>
</tr>
</table>

---

## 📸 功能展示

### 单图生成模式
- ✨ 智能提示词优化
- 🎨 风格预设选择器
- ⚙️ 高级参数控制（尺寸、步数、引导度）
- 🔄 一键重新生成
- 💾 缓存状态显示

### 批量生成模式
- 🔥 并行生成最多 10 张图片
- 📊 实时进度显示
- 📥 批量下载
- ⏱️ 队列管理

---

## 🚀 快速开始

### 前置要求

- **Node.js** 18.0 或更高版本
- **Cloudflare 账号**（免费）
- **Git**

### 一键安装

```bash
# 克隆仓库
git clone https://github.com/kinai9661/flux2-pro-generator.git
cd flux2-pro-generator

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 即可使用！

### 部署到生产环境

#### 方式 1: Cloudflare Pages（推荐）

```bash
# 1. 创建 KV 命名空间
wrangler kv:namespace create IMAGE_CACHE

# 2. 更新 wrangler.jsonc 中的 KV ID

# 3. 部署
npm run deploy
```

#### 方式 2: Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kinai9661/flux2-pro-generator)

详细部署指南：
- [Cloudflare 部署文档](./DEPLOYMENT.md)
- [Vercel 部署文档](./VERCEL_DEPLOYMENT.md)

---

## 🛠️ 技术栈

### 前端
- **框架**: Next.js 15.0 (App Router)
- **UI**: React 18 + TypeScript
- **样式**: Tailwind CSS 3.4
- **状态管理**: React Hooks

### 后端
- **运行时**: Cloudflare Workers (Edge Runtime)
- **AI 模型**: FLUX.2 [dev] by Black Forest Labs
- **缓存**: Cloudflare KV Storage
- **API**: REST + Edge Functions

### 开发工具
- **包管理**: npm / yarn / pnpm
- **构建工具**: OpenNext for Cloudflare
- **部署**: Wrangler CLI / Vercel CLI
- **CI/CD**: GitHub Actions

---

## 📖 使用指南

### 基础生成

1. **输入提示词**
   ```
   A cyberpunk cat wearing sunglasses in neon-lit Tokyo streets
   ```

2. **选择风格**（可选）
   - 写实风格 (Photorealistic)
   - 动漫风格 (Anime)
   - 赛博朋克 (Cyberpunk)
   - 极简主义 (Minimalist)
   - 复古风格 (Vintage)
   - 人像摄影 (Portrait)
   - 风景摄影 (Landscape)
   - 产品摄影 (Product)

3. **调整参数**
   - 图片尺寸: 512×512 ~ 1024×1024
   - 生成步数: 1-8 (质量 vs 速度)
   - 引导度: 1.0-5.0 (创意 vs 准确)

4. **点击生成** 🚀

### 高级功能

#### 提示词优化
```typescript
// 原始提示词
"a cat"

// 自动优化后
"a cat, professional photography, high quality, detailed, 8k resolution"
```

#### 批量生成
```javascript
const prompts = [
  "Sunset over mountains",
  "Modern city skyline",
  "Abstract art patterns"
];
// 一次生成 3 张图片
```

#### JSON 提示词（高级控制）
```json
{
  "subject": "portrait of a woman",
  "style": "photorealistic",
  "lighting": "golden hour",
  "camera": "85mm lens, f/1.4",
  "colors": ["#FF6B6B", "#4ECDC4"]
}
```

---

## 📊 性能指标

### 生成速度
- **快速模式** (1-2 步): ~2 秒
- **标准模式** (4 步): ~4 秒
- **高质量模式** (6-8 步): ~8 秒

### 缓存性能
- **首次生成**: 2-8 秒
- **缓存命中**: < 500ms
- **命中率**: 约 70%（典型使用）

### 资源消耗
- **API 调用**: 10,000 次/天（免费额度）
- **KV 读取**: 100,000 次/天（免费额度）
- **KV 写入**: 1,000 次/天（免费额度）
- **存储空间**: 1GB（免费额度）

---

## 🔧 配置选项

### 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 账户 ID | - |
| `CLOUDFLARE_API_TOKEN` | API 令牌 | - |
| `NEXT_PUBLIC_MAX_BATCH_SIZE` | 批量生成最大数量 | 10 |
| `NEXT_PUBLIC_MAX_CONCURRENT` | 并发请求数 | 3 |
| `CACHE_TTL` | 缓存时长（秒） | 604800 (7天) |

### 自定义配置

编辑 `wrangler.jsonc`：

```jsonc
{
  "vars": {
    "MAX_BATCH_SIZE": "10",
    "MAX_CONCURRENT": "3",
    "CACHE_TTL": "604800"
  }
}
```

---

## 🎯 路线图

- [x] 基础图像生成
- [x] 智能提示词优化
- [x] 批量生成功能
- [x] KV 缓存系统
- [x] 8 种风格预设
- [x] Vercel 部署支持
- [ ] 图像编辑功能
- [ ] ControlNet 支持
- [ ] 用户账号系统
- [ ] 生成历史记录
- [ ] 社区分享功能
- [ ] API 限流管理
- [ ] WebSocket 实时推送

---

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 开发规范

- 遵循 TypeScript 最佳实践
- 添加适当的注释和类型定义
- 更新相关文档
- 确保代码通过 ESLint 检查

---

## 📄 开源协议

MIT License © 2025 [kinai9661](https://github.com/kinai9661)

查看 [LICENSE](./LICENSE) 文件了解详情。

---

## 🙏 鸣谢

- [Black Forest Labs](https://blackforestlabs.ai/) - FLUX.2 模型开发
- [Cloudflare](https://cloudflare.com/) - Workers AI 平台
- [Vercel](https://vercel.com/) - Next.js 框架
- [Next.js](https://nextjs.org/) - React 框架

---

## 📞 联系方式

- **GitHub**: [@kinai9661](https://github.com/kinai9661)
- **问题反馈**: [GitHub Issues](https://github.com/kinai9661/flux2-pro-generator/issues)
- **项目主页**: [flux2-pro-generator](https://github.com/kinai9661/flux2-pro-generator)

---

## 📈 项目统计

![GitHub stars](https://img.shields.io/github/stars/kinai9661/flux2-pro-generator?style=social)
![GitHub forks](https://img.shields.io/github/forks/kinai9661/flux2-pro-generator?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/kinai9661/flux2-pro-generator?style=social)

---

<div align="center">

### ⭐ 如果这个项目对你有帮助，请给个 Star！

**[🌟 Star this repo](https://github.com/kinai9661/flux2-pro-generator)** | **[🐛 Report Bug](https://github.com/kinai9661/flux2-pro-generator/issues)** | **[💡 Request Feature](https://github.com/kinai9661/flux2-pro-generator/issues)**

</div>
