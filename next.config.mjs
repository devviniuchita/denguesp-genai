// @ts-check
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  productionBrowserSourceMaps: false,
  excludeDefaultMomentLocales: true,
  experimental: {
    optimizeCss: true,
    // Tree shake large packages - only load what's actually used
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-label',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-separator',
      '@radix-ui/react-slot',
      '@radix-ui/react-tooltip',
    ],
    // AGGRESSIVE TBT REDUCTION (Phase 5)
    // - nextScriptWorkers: Offload scripts to Web Workers
    // - preloadEntriesOnStart: false: Don't preload unused JS entries
    nextScriptWorkers: true,
    preloadEntriesOnStart: false,
  },
  async headers() {
    return [
      {
        // Aplicar headers CORS para todas as rotas de API
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With, X-Original-URL',
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
