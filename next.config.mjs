import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    // Add other PWA-specific options here
  },
  reactStrictMode: true,
  // Add other Next.js config options here
  images: {
    domains: ["example.com", "another-domain.com"], // Example for allowed image domains
  },
});

export default nextConfig;
