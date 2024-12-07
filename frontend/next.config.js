/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@nextui-org/react', '@tremor/react'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config, { dev, isServer }) => {
    // Optimize SVG imports
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Optimize fonts
    if (!dev && !isServer) {
      Object.assign(config.optimization.splitChunks.cacheGroups, {
        fonts: {
          name: 'fonts',
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          chunks: 'all',
          priority: 20,
        },
      });
    }

    return config;
  },
};

module.exports = nextConfig;
