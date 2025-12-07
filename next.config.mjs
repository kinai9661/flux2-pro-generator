/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true
  },
  // 环境变量
  env: {
    NEXT_PUBLIC_PLATFORM: process.env.NEXT_PUBLIC_PLATFORM || 'vercel'
  }
};

export default nextConfig;
