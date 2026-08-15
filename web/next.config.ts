import type { NextConfig } from "next";

const nextConfig: NextConfig = {

    allowedDevOrigins: ['222.112.156.77'],

    async rewrites() {
        return [
            {
                // 브라우저가 /api/proxy 로 요청하면 Next.js 서버가 대신 GCP HTTP 주소로 토스합니다.
                source: '/api/proxy/:path*',
                destination: 'http://35.255.26*',
            },
        ];
    },
};

export default nextConfig;
