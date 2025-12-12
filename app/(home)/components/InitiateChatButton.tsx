"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

/**
 * Smart button that redirects based on authentication state:
 * - If authenticated → Navigate to /chat
 * - If not authenticated → Navigate to /auth/register
 */
export function InitiateChatButton() {
  const { isAuthenticated, isLoading } = useAuth();
  const mounted = useHasMounted();

  if (!mounted || isLoading) {
    // Show loading state during hydration
    return (
      <Button
        size="lg"
        className="w-full sm:w-auto gap-2 text-base h-12 px-8"
        disabled
      >
        Carregando...
        <ArrowRight className="h-4 w-4" />
      </Button>
    );
  }

  // If authenticated, navigate to /chat
  if (isAuthenticated) {
    return (
      <Link href="/chat" className="w-full sm:w-auto group">
        <Button
          size="lg"
          className="w-full sm:w-auto gap-2 text-base h-12 px-8 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 group-hover:scale-[1.02]"
          aria-label="Iniciar conversa com o assistente DengueSP-GenAI"
        >
          Iniciar Conversa
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
    );
  }

  // If not authenticated, navigate to register
  return (
    <Link href="/auth/register" className="w-full sm:w-auto group">
      <Button
        size="lg"
        className="w-full sm:w-auto gap-2 text-base h-12 px-8 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 group-hover:scale-[1.02]"
        aria-label="Criar conta e iniciar conversa com o assistente DengueSP-GenAI"
      >
        Criar conta gratuita
        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </Link>
  );
}
