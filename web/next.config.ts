import type { NextConfig } from "next";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const nextConfig: NextConfig = {

    allowedDevOrigins: ['222.112.156.77'],

    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },

    async rewrites() {
        return [
            {
                source: '/api/proxy/:path*',
                destination: `${BACKEND_URL}/api/:path*`,
            },
        ];
    },
};

export default nextConfig;
