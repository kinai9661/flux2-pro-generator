# Vercel 部署环境变量设置指南

## 必要步骤：设置环境变量

### 1. 在 Vercel Dashboard 设置

访问你的项目：
```
https://vercel.com/你的用户名/flux2-pro-generator/settings/environment-variables
```

### 2. 添加以下环境变量

#### 必需变量

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `NEXT_PUBLIC_PLATFORM` | `vercel` | Production, Preview, Development |
| `CLOUDFLARE_ACCOUNT_ID` | 你的Cloudflare账户ID | Production, Preview, Development |
| `CLOUDFLARE_API_TOKEN` | 你的Cloudflare API令牌 | Production, Preview, Development |

#### 可选变量

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NEXT_PUBLIC_APP_NAME` | `FLUX.2 Pro Generator` | 应用名称 |
| `NEXT_PUBLIC_MAX_BATCH_SIZE` | `10` | 批量生成最大数量 |
| `NEXT_PUBLIC_MAX_CONCURRENT` | `3` | 并发请求数 |

### 3. 获取 Cloudflare 凭证

#### 获取 Account ID

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 登录后点击右上角头像
3. 选择 **Account Home**
4. 在右侧找到 **Account ID**
5. 点击复制

#### 创建 API Token

1. 访问 [API Tokens 页面](https://dash.cloudflare.com/profile/api-tokens)
2. 点击 **Create Token**
3. 选择 **Edit Cloudflare Workers** 模板
4. 或创建自定义 Token，设置权限：
   ```
   Account > Workers AI > Edit
   Account > Workers KV Storage > Edit (可选)
   ```
5. 点击 **Continue to summary**
6. 点击 **Create Token**
7. **重要**：复制生成的 Token（只显示一次！）

### 4. 在 Vercel 添加环境变量

#### 方法 A：通过 Dashboard

1. 点击 **Add New**
2. 输入变量名：`NEXT_PUBLIC_PLATFORM`
3. 输入值：`vercel`
4. 选择所有环境：☑️ Production ☑️ Preview ☑️ Development
5. 点击 **Save**
6. 重复以上步骤添加其他变量

#### 方法 B：通过 CLI

```bash
# 设置平台
vercel env add NEXT_PUBLIC_PLATFORM
# 输入: vercel
# 选择: Production, Preview, Development

# 设置 Cloudflare Account ID
vercel env add CLOUDFLARE_ACCOUNT_ID
# 粘贴你的 Account ID
# 选择: Production, Preview, Development

# 设置 Cloudflare API Token
vercel env add CLOUDFLARE_API_TOKEN
# 粘贴你的 API Token
# 选择: Production, Preview, Development
```

### 5. 重新部署

添加环境变量后，需要触发重新部署：

#### 方法 A：通过 Dashboard

1. 在 Vercel Dashboard 中，进入你的项目
2. 点击 **Deployments** 选项卡
3. 点击最新部署旁的三点菜单
4. 选择 **Redeploy**

#### 方法 B：通过 Git Push

```bash
# 触发空提交，不修改代码）
git commit --allow-empty -m "Trigger redeploy with env vars"
git push origin main
```

#### 方法 C：通过 CLI

```bash
vercel --prod
```

## 验证部署

### 1. 检查环境变量

```bash
# 列出所有环境变量
vercel env ls

# 应该看到：
# NEXT_PUBLIC_PLATFORM        Production, Preview, Development
# CLOUDFLARE_ACCOUNT_ID       Production, Preview, Development
# CLOUDFLARE_API_TOKEN        Production, Preview, Development
```

### 2. 测试应用

1. 访问你的 Vercel URL
2. 应该看到 "Running on Vercel" 标签
3. 输入提示词并生成图片
4. 打开浏览器控制台，应该看到：
   ```
   Platform detected: { platform: 'vercel', apiEndpoint: '/api/generate-vercel', ... }
   Using API endpoint: /api/generate-vercel
   ```

### 3. 查看日志

```bash
# 实时日志
vercel logs --follow

# 或在 Dashboard
# Deployments → 选择部署 → Function Logs
```

## 常见问题

### Q: 仍然显示 500 错误

**A**: 检查：
1. 环境变量是否正确设置
2. `NEXT_PUBLIC_PLATFORM` 是否为 `vercel`
3. Cloudflare 凭证是否有效
4. 检查函数日志查看详细错误

### Q: 如何测试 Cloudflare 凭证

**A**: 使用 curl 测试：

```bash
curl -X POST "https://api.cloudflare.com/client/v4/accounts/你的ACCOUNT_ID/ai/run/@cf/black-forest-labs/flux-2-dev" \
  -H "Authorization: Bearer 你的API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"test"}' \
  -o test.png
```

如果成功，会生成 `test.png` 文件。

### Q: 如何更新环境变量

**A**: 

```bash
# 删除旧变量
vercel env rm CLOUDFLARE_API_TOKEN production

# 添加新变量
vercel env add CLOUDFLARE_API_TOKEN

# 重新部署
vercel --prod
```

### Q: 环境变量在 Preview 中不生效

**A**: 确保添加变量时选择了 **Preview** 环境。

## 完整示例

```bash
# 一键设置所有环境变量

# 1. 设置平台
vercel env add NEXT_PUBLIC_PLATFORM
# 输入: vercel
# 选择: All (Production, Preview, Development)

# 2. 设置 Cloudflare Account ID
vercel env add CLOUDFLARE_ACCOUNT_ID
# 粘贴: abc123def456...
# 选择: All

# 3. 设置 Cloudflare API Token  
vercel env add CLOUDFLARE_API_TOKEN
# 粘贴: your_token_here...
# 选择: All

# 4. 重新部署
vercel --prod

# 5. 查看部署状态
vercel ls

# 6. 查看实时日志
vercel logs --follow
```

## 成功标志

当你看到以下内容时，说明设置成功：

1. ✅ 页面显示 "Running on Vercel"
2. ✅ 控制台显示 "Platform detected: vercel"
3. ✅ API 调用使用 `/api/generate-vercel`
4. ✅ 图片成功生成
5. ✅ 无 500 错误

---

**票源：需要帮助？**

- [GitHub Issues](https://github.com/kinai9661/flux2-pro-generator/issues)
- [Vercel 支持](https://vercel.com/support)
- [Cloudflare 文档](https://developers.cloudflare.com/workers-ai/)
