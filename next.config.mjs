/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'ui-avatars.com',
            },
            {
                protocol: 'https',
                hostname: 'authjs.dev',
            },
            {
                // This is the new entry for your Supabase Storage
                protocol: 'https',
                hostname: 'ajxeqiiumzuqfljbkhln.supabase.co',
            },
        ],
    },
};

export default nextConfig;
