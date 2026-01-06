/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        APP_VERSION: process.env.VERCEL_GIT_COMMIT_SHA || 'local-dev',
        APP_BUILD_DATE: new Date().toISOString(),
    },
};

export default nextConfig;
