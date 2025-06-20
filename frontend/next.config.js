/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    compiler: {
        removeConsole: process.env.NODE_ENV === "production",
    },
};

module.exports = nextConfig;