"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { MessageCircle, ShieldCheck, Zap } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Suspense } from 'react';
import { HeroHeadline } from './HeroHeadline';
import { HeroNavigation } from './HeroNavigation';

// Optimize LCP: Preload HeroVisual component bundle aggressively
const HeroVisual = dynamic(
  () => import('./HeroVisual').then((mod) => mod.HeroVisual),
  {
    ssr: true,
    loading: () => <HeroVisualSkeleton />,
  },
);

function HeroVisualSkeleton() {
  return (
    <div className='relative w-full max-w-[500px] aspect-square lg:aspect-[4/5] mx-auto'>
      <div className='absolute inset-0 rounded-[32px] bg-muted/30 border border-muted/40 animate-pulse' />
      <div className='absolute inset-8 rounded-[28px] bg-muted/20 blur-2xl animate-pulse delay-150' />
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const FEATURE_CARDS = [
  {
    icon: ShieldCheck,
    title: "Informação Confiável",
    desc: "Baseado em protocolos oficiais do Ministério da Saúde e Secretaria de Saúde de SP.",
    iconBg: "bg-blue-50 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Zap,
    title: "Respostas Rápidas",
    desc: "Tire suas dúvidas instantaneamente sem precisar navegar por dezenas de sites.",
    iconBg: "bg-emerald-50 dark:bg-emerald-900/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: MessageCircle,
    title: "Fácil de Usar",
    desc: "Interface de chat intuitiva, similar ao WhatsApp, acessível para todas as idades.",
    iconBg: "bg-violet-50 dark:bg-violet-900/30",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
] as const;

export function LandingPageContent() {
  return (
    <div className='flex flex-col min-h-screen light-bg-premium'>
      <HeroNavigation />

      <main className='flex-1'>
        {/* Hero Section */}
        <section className='container mx-auto px-6 pt-2 pb-12 lg:pt-0 lg:pb-20 relative'>
          {/* Hero Background Decorations */}
          <div className="absolute top-0 left-[10%] w-[40%] h-[60%] bg-primary/5 rounded-full blur-[100px] -z-10 dark:bg-primary/10" />
          <div className="absolute bottom-0 right-[5%] w-[30%] h-[40%] bg-blue-400/5 rounded-full blur-[80px] -z-10 dark:bg-blue-500/10" />

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start'>
            <HeroHeadline />
            <Suspense fallback={<HeroVisualSkeleton />}>
              <HeroVisual />
            </Suspense>
          </div>
        </section>

        {/* Why Section - Glassmorphism Premium */}
        <section id='sobre' className='py-24 relative overflow-hidden'>
          {/* Background Decoration */}
          <div className="absolute inset-0 bg-gradient-to-b from-muted/40 via-muted/20 to-transparent dark:from-muted/20 dark:via-muted/10" />
          <div className="absolute -left-[15%] top-[10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] dark:bg-primary/10" />
          <div className="absolute -right-[15%] bottom-[10%] w-[50%] h-[50%] bg-blue-400/5 rounded-full blur-[120px] dark:bg-blue-500/10" />

          <motion.div
            className='container mx-auto px-6 relative z-10'
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={itemVariants} className='text-center max-w-2xl mx-auto mb-16'>
              <h2 className='text-3xl md:text-4xl font-bold tracking-tight mb-6'>
                Por que usar o{' '}
                <span className='bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600'>
                  DengueSP-GenAI
                </span>
                ?
              </h2>
              <p className='text-lg text-muted-foreground leading-relaxed'>
                Uma ferramenta desenvolvida para combater a desinformação e auxiliar no combate à
                dengue em São Paulo, unindo dados oficiais e tecnologia de ponta.
              </p>
            </motion.div>

            <motion.div variants={containerVariants} className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {FEATURE_CARDS.map((card) => (
                <motion.div
                  key={card.title}
                  variants={itemVariants}
                  whileHover={{ y: -8, transition: { duration: 0.25 } }}
                  className="group"
                >
                  <Card className='h-full bg-white/70 dark:bg-white/5 backdrop-blur-md border border-gray-200/60 dark:border-white/10 shadow-sm hover:shadow-[0_20px_50px_-12px_rgba(0,92,255,0.15)] transition-all duration-300 overflow-hidden'>
                    {/* Top accent bar */}
                    <div className="h-1 w-full bg-gradient-to-r from-primary/80 to-blue-500/80 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    <CardHeader className="pt-6">
                      <div className={`h-14 w-14 rounded-2xl ${card.iconBg} ${card.iconColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <card.icon className='h-7 w-7' />
                      </div>
                      <CardTitle className="text-xl">{card.title}</CardTitle>
                    </CardHeader>
                    <CardContent className='text-muted-foreground'>
                      {card.desc}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className='border-t py-12 bg-background/80 backdrop-blur-sm'
        >
          <div className='container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6'>
            <Link href='/' className='flex items-center gap-2 hover:opacity-80 transition-opacity'>
              <div className='h-6 w-6 rounded bg-primary/20 flex items-center justify-center'>
                <span className='text-xs font-bold text-primary'>D</span>
              </div>
              <span className='font-semibold'>DengueSP-GenAI</span>
            </Link>
            <p className='text-sm text-muted-foreground text-center md:text-left'>
              © 2025 DengueSP-GenAI. Todos os direitos reservados.
            </p>
            <div className='flex gap-6 text-sm text-muted-foreground'>
              <Link href='/privacidade' className='hover:text-foreground transition-colors'>
                Privacidade
              </Link>
              <Link href='/termos' className='hover:text-foreground transition-colors'>
                Termos
              </Link>
            </div>
          </div>
        </motion.footer>
      </main>
    </div>
  );
}
