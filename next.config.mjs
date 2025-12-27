/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude native modules from Turbopack bundling (fixes symlink issues on Windows)
  serverExternalPackages: ['bcrypt'],
  
  // Trigger rebuild for file rename issues (cache cleared - patterns updated)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ecommerece-aadhanaa.s3.eu-north-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;