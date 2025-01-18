/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: true
  },
  // 确保 public/uploads 目录被复制到 standalone 目录
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/uploads/:path*',
      },
    ]
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
