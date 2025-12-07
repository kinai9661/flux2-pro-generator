# 🚀 Deployment Guide

## Quick Deploy to Cloudflare Pages

### Prerequisites

1. **Cloudflare Account** - [Sign up](https://dash.cloudflare.com/sign-up)
2. **Node.js 18+** installed locally
3. **Wrangler CLI** installed globally

```bash
npm install -g wrangler
```

## Step-by-Step Deployment

### 1. Clone and Install

```bash
git clone https://github.com/kinai9661/flux2-pro-generator.git
cd flux2-pro-generator
npm install
```

### 2. Create KV Namespace

```bash
# Login to Cloudflare
wrangler login

# Create KV namespace for production
wrangler kv:namespace create IMAGE_CACHE

# Create KV namespace for preview (optional)
wrangler kv:namespace create IMAGE_CACHE --preview
```

You'll get output like:
```
🎉 Created KV namespace IMAGE_CACHE
✨ Add the following to your wrangler.jsonc:
{ binding = "IMAGE_CACHE", id = "abc123xyz..." }
```

### 3. Update Configuration

Edit `wrangler.jsonc` and replace `REPLACE_WITH_YOUR_KV_ID` with your actual KV namespace ID:

```jsonc
{
  "kv_namespaces": [
    {
      "binding": "IMAGE_CACHE",
      "id": "YOUR_ACTUAL_KV_ID_HERE"  // ← Replace this
    }
  ]
}
```

### 4. Local Development

```bash
# Standard Next.js dev server
npm run dev

# Test in Workers environment locally
npm run preview
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Cloudflare

#### Option A: Command Line

```bash
npm run deploy
```

#### Option B: Cloudflare Dashboard (Recommended)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** → **Create a project**
3. Connect your GitHub account
4. Select `flux2-pro-generator` repository
5. Configure build settings:
   - **Build command**: `npm run pages:build`
   - **Build output directory**: `.vercel/output/static`
   - **Root directory**: `/` (default)
6. Add environment bindings:
   - **AI Binding**: Name `AI`, select Workers AI
   - **KV Binding**: Name `IMAGE_CACHE`, select your KV namespace
7. Click **Save and Deploy**

### 6. Custom Domain (Optional)

1. In your Cloudflare Pages project settings
2. Go to **Custom domains**
3. Click **Set up a custom domain**
4. Enter your domain (e.g., `flux2.yourdomain.com`)
5. Cloudflare will automatically configure DNS

## Environment Variables

No API keys or environment variables needed! Everything uses Cloudflare Workers AI bindings.

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules .next
npm install
npm run build
```

### KV Binding Not Found

Make sure:
1. KV namespace is created
2. `wrangler.jsonc` has correct KV ID
3. In Cloudflare Pages settings, KV binding is added

### AI Model Not Found

Ensure:
1. AI binding is configured in Pages settings
2. Your Cloudflare account has Workers AI enabled
3. Model name is correct: `@cf/black-forest-labs/flux-2-dev`

## Performance Optimization

### Enable Caching

Caching is enabled by default. Configure in `wrangler.jsonc`:

```jsonc
{
  "vars": {
    "CACHE_TTL": "604800"  // 7 days in seconds
  }
}
```

### Rate Limiting

Adjust concurrent requests:

```jsonc
{
  "vars": {
    "MAX_CONCURRENT": "3",  // Parallel generations
    "MAX_BATCH_SIZE": "10"  // Max batch size
  }
}
```

## Cost Estimation

### Cloudflare Workers AI (Free Tier)
- **10,000 requests/day** FREE
- After that: $0.011 per 1,000 requests

### Cloudflare KV (Free Tier)
- **100,000 reads/day** FREE
- **1,000 writes/day** FREE
- **1 GB storage** FREE

### Example Usage
- **1,000 generations/day**: 100% FREE
- **50% cache hit rate**: ~500 KV reads, 500 AI calls
- **Storage**: ~100 MB for cached images

## Monitoring

View analytics in Cloudflare Dashboard:
1. Go to **Pages** → Your project
2. Click **Analytics** tab
3. View:
   - Request count
   - Cache hit rate
   - Error rate
   - Response time

## Updates

Pull latest changes:

```bash
git pull origin main
npm install
npm run deploy
```

Or enable **Auto Deploy** in Cloudflare Pages settings for automatic deployments on push.

## Support

- [GitHub Issues](https://github.com/kinai9661/flux2-pro-generator/issues)
- [Cloudflare Community](https://community.cloudflare.com/)
- [Workers AI Docs](https://developers.cloudflare.com/workers-ai/)

---

**Happy Generating! 🎨**
