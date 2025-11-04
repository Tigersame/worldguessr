// const path = require('path');
// const process = require('process');
// const CopyWebpackPlugin = require('copy-webpack-plugin');

import path from 'path';
import process from 'process';
import { execSync } from 'child_process';

const pathBuilder = (subpath) => path.join(process.cwd(), subpath);

// Get commit hash and build time
const getCommitHash = () => {
    try {
        return execSync('git rev-parse --short HEAD').toString().trim();
    } catch (error) {
        return 'unknown';
    }
};

const getBuildTime = () => {
    return new Date().toISOString();
};

const __dirname = path.resolve();
/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_COMMIT_HASH: getCommitHash(),
        NEXT_PUBLIC_BUILD_TIME: getBuildTime(),
    },
    webpack: (config, { webpack }) => {
        return config
    },
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    images: {
        unoptimized: true,
    },
    // output: 'export', // Commented out for Vercel deployment (needs API routes)
    async rewrites() {
        return [
            {
                source: '/map/:slug',
                destination: '/map?s=:slug',
            },
        ];
    },
    // Generate a stable build ID to prevent cache issues
    generateBuildId: async () => {
        // Use commit hash and timestamp for unique build IDs
        const commitHash = getCommitHash();
        const timestamp = Date.now();
        return `${commitHash}-${timestamp}`;
    },
    // Add headers to prevent caching of HTML (chunks are hashed so they're safe to cache)
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=0, must-revalidate',
                    },
                ],
            },
            {
                source: '/_next/static/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },

    // assetPrefix: './', we cant use this because it breaks dynamic paths (https://nextjs.org/docs/app/api-reference/config/next-config-js/assetPrefix)
};

// module.exports = nextConfig;
export default nextConfig;