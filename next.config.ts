import type {NextConfig} from 'next';

// Validate required environment variables
const requiredEnvVars = {
  GOOGLE_GENAI_API_KEY: process.env.GOOGLE_GENAI_API_KEY,
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

// Check for missing environment variables during build
const missingEnvVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key, _]) => key);

if (missingEnvVars.length > 0 && process.env.NODE_ENV !== 'development') {
  console.warn('⚠️  Missing environment variables:', missingEnvVars.join(', '));
  console.warn('📖 Please check the API_SETUP.md file for configuration instructions');
}

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
