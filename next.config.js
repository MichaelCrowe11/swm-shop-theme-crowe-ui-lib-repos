/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // 🔒 Fix CSP iframe embedding for Shopify stores
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              // Allow embedding in Shopify stores
              "frame-ancestors 'self' https://*.myshopify.com https://vqgq3f-yt.myshopify.com",
              // Allow unsafe-inline for dynamic styles (needed for React components)
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Allow external fonts
              "font-src 'self' https://fonts.gstatic.com",
              // Allow scripts from same origin and inline
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              // Allow images from any source
              "img-src 'self' data: https: http:",
              // Allow connections to APIs
              "connect-src 'self' https://api.elevenlabs.io https://*.shopify.com https://*.myshopify.com wss: ws:",
              // Allow media from any source
              "media-src 'self' data: https: http:",
            ].join('; ')
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ],
      },
    ];
  },
  
  // 🌐 Environment variables for different deployments
  env: {
    SHOPIFY_STOREFRONT_URL: process.env.SHOPIFY_STOREFRONT_URL || 'https://vqgq3f-yt.myshopify.com',
    ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
    NODE_ENV: process.env.NODE_ENV || 'production',
  },
  
  // 🚀 Build optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@heroicons/react'],
  },
  
  // 📱 Image optimization
  images: {
    domains: [
      'cdn.shopify.com',
      'shopify.com',
      'myshopify.com',
      'localhost'
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // 🔧 Build configuration
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  
  // 📦 Bundle analyzer (uncomment for debugging)
  // bundleAnalyzer: {
  //   enabled: process.env.ANALYZE === 'true',
  // },
  
  // 🎯 Redirects for legacy routes
  async redirects() {
    return [
      {
        source: '/crowe-logic',
        destination: '/',
        permanent: false,
      },
      {
        source: '/audiobook',
        destination: '/voice-assistant',
        permanent: false,
      },
    ];
  },
  
  // 🔄 Rewrites for API routes
  async rewrites() {
    return [
      {
        source: '/api/shopify/:path*',
        destination: 'https://vqgq3f-yt.myshopify.com/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
