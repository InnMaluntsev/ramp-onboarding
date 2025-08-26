/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/ramp-onboarding' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/ramp-onboarding/' : '',
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig