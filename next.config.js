// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Waarschuwing: Dit is alleen tijdelijk voor ontwikkeling
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig