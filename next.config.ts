import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 31622400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.agromakers.africa',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/vi/**',
      },
    ],
  },

  async redirects() {
    return [
      {
        source: '/wp-admin/:path*',
        destination: 'https://api.agromakers.africa/wp-admin/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
