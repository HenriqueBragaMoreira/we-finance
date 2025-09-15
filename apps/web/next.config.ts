import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => {
    return {
      beforeFiles: [
        // api/auth to backend_url
        {
          source: "/api/:path*",
          destination: new URL(
            "/api/:path*",
            process.env.NEXT_PUBLIC_API_URL
          ).toString(),
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: true,
      },
    ];
  },
  devIndicators: false,
};

export default nextConfig;
