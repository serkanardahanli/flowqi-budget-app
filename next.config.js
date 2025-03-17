// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Expliciet client-side rendering voor de sales pagina
  experimental: {
    serverComponents: true,
  },
}

module.exports = nextConfig