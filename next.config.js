/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone is for Docker; Vercel uses its own output pipeline.
  ...(process.env.DOCKER_BUILD === "1" ? { output: "standalone" } : {}),
  images: {
    remotePatterns: [],
  },
};

module.exports = nextConfig;
