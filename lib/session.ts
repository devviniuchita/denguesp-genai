import { User } from "@/types/auth";

/**
 * Utilitários para gerenciamento de sessão
 */

export interface Session {
  user: User;
  expires: string;
}

/**
 * Obtém a sessão do usuário atual (client-side)
 */
export async function getSession(): Promise<Session | null> {
  try {
    const response = await fetch("/api/auth/nextauth?action=session", {
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    const session = await response.json();
    return session;
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }
}

/**
 * Verifica se o usuário está autenticado (client-side)
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

/**
 * Limpa a sessão local (client-side)
 */
export function clearLocalSession(): void {
  localStorage.removeItem("dengue_session_token");
}
