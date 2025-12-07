# 🚀 Vercel 部署完整指南

## 部署架構說明

本項目支持兩種部署方式：
1. **Cloudflare Pages** - 推薦用於生產環境（免費額度更高）
2. **Vercel** - 本指南涵蓋的部署方式

### Vercel 部署特點
- ✅ 全球 CDN 加速
- ✅ 自動 HTTPS
- ✅ GitHub 集成自動部署
- ✅ 環境變量管理
- ⚠️ **注意**: Vercel 不支持 Cloudflare Workers AI，需要通過 API 調用

---

## 第一步：準備 Cloudflare API 憑證

由於 Vercel 無法直接使用 Cloudflare Workers AI Binding，我們需要通過 REST API 調用。

### 1.1 獲取 Cloudflare Account ID

1. 登入 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 點擊右上角頭像 → **Account Home**
3. 在右側找到 **Account ID**，複製保存

### 1.2 創建 API Token

1. 進入 [API Tokens 頁面](https://dash.cloudflare.com/profile/api-tokens)
2. 點擊 **Create Token**
3. 選擇 **Edit Cloudflare Workers** 模板
4. 或使用 **Custom Token**，設置以下權限：
   - **Account** → **Workers AI** → **Edit**
   - **Account** → **Workers KV Storage** → **Edit**
5. 點擊 **Continue to summary** → **Create Token**
6. **重要**: 複製生成的 Token（只會顯示一次）

### 1.3 創建 KV Namespace（可選 - 用於緩存）

```bash
# 安裝 Wrangler CLI
npm install -g wrangler

# 登入
wrangler login

# 創建 KV Namespace
wrangler kv:namespace create IMAGE_CACHE
```

記下返回的 Namespace ID。

---

## 第二步：部署到 Vercel

### 方式 A：通過 Vercel Dashboard（推薦）

1. 訪問 [Vercel](https://vercel.com)
2. 點擊 **New Project**
3. 從 GitHub 導入 `flux2-pro-generator` 倉庫
4. 配置項目：

   **Framework Preset**: Next.js  
   **Root Directory**: `./`  
   **Build Command**: `npm run build`  
   **Output Directory**: `.next`

5. **環境變量配置** - 點擊 **Environment Variables**，添加以下變量：

#### 必需的環境變量

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `CLOUDFLARE_ACCOUNT_ID` | 你的 Account ID | Production, Preview, Development |
| `CLOUDFLARE_API_TOKEN` | 你的 API Token | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://你的域名.vercel.app` | Production |
| `NEXT_PUBLIC_APP_NAME` | `FLUX.2 Pro Generator` | All |

#### 可選的環境變量

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `KV_NAMESPACE_ID` | 你的 KV ID | 啟用緩存功能 |
| `NEXT_PUBLIC_MAX_BATCH_SIZE` | `10` | 批量生成最大數量 |
| `NEXT_PUBLIC_MAX_CONCURRENT` | `3` | 並發請求數 |
| `CACHE_TTL` | `604800` | 緩存時長（秒） |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` | Google Analytics |

6. 點擊 **Deploy** 開始部署

### 方式 B：通過 Vercel CLI

```bash
# 安裝 Vercel CLI
npm install -g vercel

# 登入
vercel login

# 在項目目錄下執行
cd flux2-pro-generator
vercel

# 按提示操作，選擇：
# - Link to existing project? No
# - What's your project's name? flux2-pro-generator
# - In which directory is your code located? ./
# - Override settings? No

# 部署完成後，配置環境變量
vercel env add CLOUDFLARE_ACCOUNT_ID
vercel env add CLOUDFLARE_API_TOKEN

# 重新部署以應用環境變量
vercel --prod
```

---

## 第三步：修改 API 路由以支持 Vercel

由於 Vercel 不支持 Edge Runtime 的 Cloudflare 特性，需要修改 API 路由：

### 3.1 創建 Vercel 專用的 API 路由

創建 `app/api/generate-vercel/route.ts`：

```typescript
import { NextRequest, NextResponse } from 'next/server';

interface GenerateRequest {
  prompt: string;
  width?: number;
  height?: number;
  num_steps?: number;
  guidance?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { prompt, width = 1024, height = 1024, num_steps = 4, guidance = 3.5 } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // 調用 Cloudflare Workers AI REST API
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId || !apiToken) {
      return NextResponse.json(
        { error: 'Cloudflare credentials not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/black-forest-labs/flux-2-dev`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          width,
          height,
          num_steps,
          guidance
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Cloudflare API error: ${error}`);
    }

    const imageBuffer = await response.arrayBuffer();

    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error: any) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate image', details: error.message },
      { status: 500 }
    );
  }
}
```

### 3.2 更新前端 API 調用

修改 `app/components/ImageGenerator.tsx` 中的 API endpoint：

```typescript
// 檢測部署環境
const apiEndpoint = process.env.NEXT_PUBLIC_VERCEL_URL 
  ? '/api/generate-vercel'  // Vercel 環境
  : '/api/generate-cached'; // Cloudflare 環境

const response = await fetch(apiEndpoint, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt, ...settings })
});
```

---

## 第四步：性能優化

### 4.1 配置 Edge Functions（可選）

在 Vercel 上啟用 Edge Runtime 以獲得更快的響應速度：

修改 `app/api/generate-vercel/route.ts` 頂部：

```typescript
export const runtime = 'edge';
export const maxDuration = 30; // 最長執行時間
```

### 4.2 啟用圖像優化

在 `next.config.mjs` 中：

```javascript
const nextConfig = {
  images: {
    unoptimized: false, // Vercel 支持圖像優化
    domains: ['flux2-pro-generator.vercel.app'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  }
};
```

---

## 第五步：自定義域名

1. 在 Vercel Dashboard → 你的項目 → **Settings** → **Domains**
2. 點擊 **Add Domain**
3. 輸入域名（如 `flux2.yourdomain.com`）
4. 在你的 DNS 提供商添加 CNAME 記錄：
   ```
   CNAME  flux2  cname.vercel-dns.com
   ```
5. 等待 DNS 生效（通常幾分鐘）

---

## 第六步：監控與分析

### Vercel Analytics

```bash
# 安裝 Vercel Analytics
npm install @vercel/analytics
```

在 `app/layout.tsx` 中添加：

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## 常見問題

### Q1: 部署成功但生成圖片失敗
**A**: 檢查環境變量是否正確配置，特別是 `CLOUDFLARE_ACCOUNT_ID` 和 `CLOUDFLARE_API_TOKEN`。

### Q2: API 調用超時
**A**: 在 `vercel.json` 中增加函數超時時間：
```json
{
  "functions": {
    "app/api/generate-vercel/route.ts": {
      "maxDuration": 30
    }
  }
}
```

### Q3: 環境變量在預覽部署中不生效
**A**: 確保在添加環境變量時選擇了 **Preview** 環境。

### Q4: 如何查看部署日誌？
**A**: Vercel Dashboard → 你的項目 → **Deployments** → 選擇部署 → **Function Logs**

---

## 成本估算

### Vercel 免費額度
- 每月 100GB 帶寬
- 無限的部署
- 100GB-小時的函數執行時間

### Cloudflare Workers AI 調用
- 免費額度: 每天 10,000 次
- 超出後: $0.011 / 1,000 次請求

### 預估成本（1000 用戶/天）
- Vercel: **免費**
- Cloudflare AI: **免費**（1000 次 < 10,000 限額）

---

## 對比：Cloudflare Pages vs Vercel

| 特性 | Cloudflare Pages | Vercel |
|------|------------------|--------|
| AI 集成 | 原生 Workers AI | REST API 調用 |
| 緩存 | KV 原生支持 | 需自建 |
| 冷啟動 | 幾乎無 | 0-50ms |
| 全球節點 | 300+ | 100+ |
| 免費帶寬 | 無限 | 100GB/月 |
| 部署速度 | 快 | 非常快 |
| **推薦場景** | 生產環境 | 快速原型 |

---

**部署完成！** 🎉

訪問你的應用: `https://flux2-pro-generator.vercel.app`
