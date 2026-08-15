import type { NextConfig } from "next";

const nextConfig: NextConfig = {

    allowedDevOrigins: ['222.112.156.77'],

    async rewrites() {
        return [
            {
                source: '/api/proxy/:path*',
                destination: 'http://35.255.26.248:8080/api/:path*',
            },
        ];
    },
};

export default nextConfig;
