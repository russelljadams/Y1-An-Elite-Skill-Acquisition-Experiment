/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/experiment", destination: "/method", permanent: true },
      { source: "/data", destination: "/progress", permanent: true },
      { source: "/data/tracks/:track", destination: "/progress/:track", permanent: true },
      { source: "/reference", destination: "/method", permanent: true },
      { source: "/reference/deliberate-practice", destination: "/method/deliberate-practice", permanent: true },
      { source: "/reference/variance-collapse", destination: "/method/variance-collapse", permanent: true },
      { source: "/reference/the-constraints", destination: "/method/the-constraints", permanent: true },
    ];
  },
};

export default nextConfig;
