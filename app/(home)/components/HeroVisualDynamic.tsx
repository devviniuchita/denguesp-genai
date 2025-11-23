/**
 * Dynamic loader for HeroVisual component
 * This ensures Framer Motion is only loaded when the HeroVisual component is actually needed
 * Priority: Code split Framer Motion to reduce initial bundle
 */

import dynamic from 'next/dynamic';

// Skeleton fallback while HeroVisual is loading
const HeroVisualSkeleton = () => (
  <div className="relative w-full max-w-[500px] aspect-square lg:aspect-[4/5] mx-auto animate-pulse">
    <div className="absolute inset-0 rounded-[32px] bg-muted/30 border border-muted/40" />
    <div className="absolute inset-8 rounded-[28px] bg-muted/20 blur-2xl" />
  </div>
);

// Dynamically import HeroVisual - this moves Framer Motion to a separate chunk
export const HeroVisualDynamic = dynamic(
  () => import('./HeroVisual').then((mod) => mod.HeroVisual),
  {
    loading: () => <HeroVisualSkeleton />,
    ssr: true, // Keep SSR to maintain SEO and structure
  }
);
