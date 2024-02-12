/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "cdn.filestackcontent.com",
        port: '',
      }
    ]
  },
  reactStrictMode: true,
}

module.exports = nextConfig
