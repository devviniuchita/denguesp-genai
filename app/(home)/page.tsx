import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, ShieldCheck, Zap } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Suspense } from 'react';
import { HeroHeadline } from './components/HeroHeadline';
import { HeroNavigation } from './components/HeroNavigation';

// Optimize LCP: Preload HeroVisual component bundle aggressively
// This ensures faster rendering of the hero visual on first load
const HeroVisual = dynamic(
  () => import('./components/HeroVisual').then((mod) => mod.HeroVisual),
  {
    ssr: true,
    loading: () => <HeroVisualSkeleton />,
  },
);

// Note: preload() is not available for this dynamic component
// LCP optimization handled via Suspense fallback and animation timing

function HeroVisualSkeleton() {
  return (
    <div className='relative w-full max-w-[500px] aspect-square lg:aspect-[4/5] mx-auto'>
      <div className='absolute inset-0 rounded-[32px] bg-muted/30 border border-muted/40 animate-pulse' />
      <div className='absolute inset-8 rounded-[28px] bg-muted/20 blur-2xl animate-pulse delay-150' />
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className='flex flex-col min-h-screen'>
      <HeroNavigation />

      <main className='flex-1'>
        {/* Hero Section */}
        <section className='container mx-auto px-6 py-12 lg:py-24'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center'>
            <HeroHeadline />
            <Suspense fallback={<HeroVisualSkeleton />}>
              <HeroVisual />
            </Suspense>
          </div>
        </section>

        {/* Why Section - Below fold (TBT optimization via Suspense) */}
        <section id='sobre' className='bg-muted/30 py-24'>
          <div className='container mx-auto px-6'>
            <div className='text-center max-w-2xl mx-auto mb-16'>
              <h2 className='text-3xl font-bold tracking-tight mb-4'>
                Por que usar o DengueSP-Gen?
              </h2>
              <p className='text-muted-foreground'>
                Uma ferramenta desenvolvida para combater a desinformação e auxiliar no combate à
                dengue em São Paulo.
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              <Card className='bg-background/50 backdrop-blur-sm border-none shadow-sm hover:shadow-[0_8px_32px_rgba(0,92,255,0.15)] transition-all duration-300 hover:-translate-y-1'>
                <CardHeader>
                  <div className='h-12 w-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4'>
                    <ShieldCheck className='h-6 w-6' />
                  </div>
                  <CardTitle>Informação Confiável</CardTitle>
                </CardHeader>
                <CardContent className='text-muted-foreground'>
                  Baseado em protocolos oficiais do Ministério da Saúde e Secretaria de Saúde de SP.
                </CardContent>
              </Card>

              <Card className='bg-background/50 backdrop-blur-sm border-none shadow-sm hover:shadow-[0_8px_32px_rgba(0,92,255,0.15)] transition-all duration-300 hover:-translate-y-1'>
                <CardHeader>
                  <div className='h-12 w-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-4'>
                    <Zap className='h-6 w-6' />
                  </div>
                  <CardTitle>Respostas Rápidas</CardTitle>
                </CardHeader>
                <CardContent className='text-muted-foreground'>
                  Tire suas dúvidas instantaneamente sem precisar navegar por dezenas de sites.
                </CardContent>
              </Card>

              <Card className='bg-background/50 backdrop-blur-sm border-none shadow-sm hover:shadow-[0_8px_32px_rgba(0,92,255,0.15)] transition-all duration-300 hover:-translate-y-1'>
                <CardHeader>
                  <div className='h-12 w-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-4'>
                    <MessageCircle className='h-6 w-6' />
                  </div>
                  <CardTitle>Fácil de Usar</CardTitle>
                </CardHeader>
                <CardContent className='text-muted-foreground'>
                  Interface de chat intuitiva, similar ao WhatsApp, acessível para todas as idades.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className='border-t py-12 bg-background'>
          <div className='container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6'>
            <Link href='/' className='flex items-center gap-2 hover:opacity-80 transition-opacity'>
              <div className='h-6 w-6 rounded bg-primary/20 flex items-center justify-center'>
                <span className='text-xs font-bold text-primary'>D</span>
              </div>
              <span className='font-semibold'>DengueSP-Gen</span>
            </Link>
            <p className='text-sm text-muted-foreground'>
              © 2025 DengueSP-Gen. Todos os direitos reservados.
            </p>
            <div className='flex gap-6 text-sm text-muted-foreground'>
              <a href='/privacidade' className='hover:text-foreground'>
                Privacidade
              </a>
              <a href='/termos' className='hover:text-foreground'>
                Termos
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
