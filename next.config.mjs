/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/PokeAPI/sprites/**',
      },
    ],
  },
  eslint: {
    // Disables ESLint check during builds to speed up and avoid build blocks
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
