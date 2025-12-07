// 平台检测工具

export type Platform = 'vercel' | 'cloudflare' | 'local';

export interface PlatformConfig {
  platform: Platform;
  apiEndpoint: string;
  batchApiEndpoint: string;
  supportsCache: boolean;
}

export function detectPlatform(): PlatformConfig {
  // 优先检查环境变量
  if (typeof process !== 'undefined') {
    const envPlatform = process.env.NEXT_PUBLIC_PLATFORM;
    if (envPlatform === 'vercel') {
      return {
        platform: 'vercel',
        apiEndpoint: '/api/generate-vercel',
        batchApiEndpoint: '/api/batch-generate-vercel',
        supportsCache: false
      };
    }
    if (envPlatform === 'cloudflare') {
      return {
        platform: 'cloudflare',
        apiEndpoint: '/api/generate-cached',
        batchApiEndpoint: '/api/batch-generate',
        supportsCache: true
      };
    }
  }

  // 检测 Vercel 环境
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    if (hostname.includes('vercel.app') || hostname.includes('vercel.com')) {
      return {
        platform: 'vercel',
        apiEndpoint: '/api/generate-vercel',
        batchApiEndpoint: '/api/batch-generate-vercel',
        supportsCache: false
      };
    }
    
    // 检测 Cloudflare Pages
    if (hostname.includes('pages.dev') || hostname.includes('workers.dev')) {
      return {
        platform: 'cloudflare',
        apiEndpoint: '/api/generate-cached',
        batchApiEndpoint: '/api/batch-generate',
        supportsCache: true
      };
    }
  }

  // 默认使用 Vercel API（更通用）
  return {
    platform: 'local',
    apiEndpoint: '/api/generate-vercel',
    batchApiEndpoint: '/api/batch-generate-vercel',
    supportsCache: false
  };
}

export function getPlatformName(platform: Platform): string {
  const names = {
    vercel: 'Vercel',
    cloudflare: 'Cloudflare Pages',
    local: 'Local Development'
  };
  return names[platform];
}
