/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
      "github.com",
      "www.gravatar.com",
      "res.cloudinary.com",
      "cdn.discordapp.com",
      "s3.us-west-2.amazonaws.com",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "standalone",
};

export default nextConfig;
