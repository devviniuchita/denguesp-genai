"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Smart button that redirects based on authentication state:
 * - If authenticated → Navigate to /chat
 * - If not authenticated → Navigate to /auth/register
 */
export function InitiateChatButton() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

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
      <Link href="/chat" className="w-full sm:w-auto">
        <Button
          size="lg"
          className="w-full sm:w-auto gap-2 text-base h-12 px-8"
          aria-label="Iniciar conversa com o assistente DengueSP-Gen"
        >
          Iniciar Conversa
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    );
  }

  // If not authenticated, navigate to register
  return (
    <Link href="/auth/register" className="w-full sm:w-auto">
      <Button
        size="lg"
        className="w-full sm:w-auto gap-2 text-base h-12 px-8"
        aria-label="Criar conta e iniciar conversa com o assistente DengueSP-Gen"
      >
        Criar conta gratuita
        <ArrowRight className="h-4 w-4" />
      </Button>
    </Link>
  );
}
