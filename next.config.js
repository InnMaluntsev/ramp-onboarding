/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, 
  },
  ...(isDev ? {} : {
    output: 'export',
    basePath: '/PS_Labs',
    assetPrefix: '/PS_Labs',
  }),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;