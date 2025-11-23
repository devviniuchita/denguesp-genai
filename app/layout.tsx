import { HydrationOptimizer } from "@/app/hydration-optimizer";
import { WebVitals } from "@/app/web-vitals";
import { ProxyInterceptorInit } from "@/components/proxy-interceptor-init";
import { ToastProvider } from "@/components/ui/toast";
import { AuthProvider } from "@/contexts/AuthContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./syntax-highlight.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI Chat - WhatsApp Style Interface",
  description: "Modern chat interface for AI agent interaction",
  formatDetection: { telephone: false },
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={inter.variable}
    >
      <head>
        {/* Font optimization for LCP */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />

        {/* DNS prefetch for potential CDN resources */}
        <link rel="dns-prefetch" href="//api.example.com" />
      </head>
      <body className={inter.className}>
        <HydrationOptimizer>
          <WebVitals />
          <ProxyInterceptorInit />
          <AuthProvider>
            <ToastProvider>{children}</ToastProvider>
          </AuthProvider>
        </HydrationOptimizer>
      </body>
    </html>
  );
}
