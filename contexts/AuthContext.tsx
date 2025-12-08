"use client";

import { logout as apiLogout } from "@/lib/api/auth";
import { getSession, Session } from "@/lib/session";
import { User } from "@/types/auth";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshSession = async () => {
    try {
      const newSession = await getSession();
      setSession(newSession);
    } catch (error) {
      console.error("Error refreshing session:", error);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
      setSession(null);
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }, [router]);

  const value: AuthContextType = useMemo(
    () => ({
      user: session?.user || null,
      session,
      isLoading,
      isAuthenticated: session !== null,
      logout,
      refreshSession,
    }),
    [session, isLoading, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
