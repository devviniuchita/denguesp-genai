"use client";

import { LazyMotionProvider } from "@/components/animations/LazyMotionProvider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { useMotionReady } from "@/hooks/use-motion-ready";
import { m } from "framer-motion";
import { LogOut, User } from "lucide-react";
import Link from "next/link";

export function HeroNavigation() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const shouldAnimate = useMotionReady(80);

  const renderAuthButtons = () => {
    if (isLoading) {
      return (
        <>
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-24" />
        </>
      );
    }

    if (isAuthenticated) {
      return (
        <>
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{user?.name}</span>
          </div>
          <Link href="/chat" prefetch={false}>
            <Button variant="default">Chat</Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={logout} title="Sair">
            <LogOut className="h-4 w-4" />
          </Button>
        </>
      );
    }

    return (
      <>
        <Link href="/auth/login" prefetch={true}>
          <Button variant="ghost">Entrar</Button>
        </Link>
        <Link href="/auth/register" prefetch={true}>
          <Button>Começar</Button>
        </Link>
      </>
    );
  };

  return (
    <LazyMotionProvider>
      <m.nav
        initial={shouldAnimate ? { opacity: 0, y: -20 } : false}
        animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
        transition={shouldAnimate ? { duration: 0.5 } : undefined}
        className="container mx-auto flex items-center justify-between p-6"
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-primary"
              aria-label="Logo DengueSP-Gen"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">DengueSP-Gen</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#sobre"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Sobre
          </Link>
          <Link
            href="/como-funciona"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Como funciona
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {renderAuthButtons()}
        </div>
      </m.nav>
    </LazyMotionProvider>
  );
}
