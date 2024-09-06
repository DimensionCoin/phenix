import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [ "https://tokens.jup.ag/token"], // Example for allowed image domains
  },
  // Add other Next.js config options here
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  // Add other PWA-specific options here
})(nextConfig);
