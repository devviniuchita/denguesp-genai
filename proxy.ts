import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Proxy do Next.js para proteger rotas autenticadas
 * Verifica a presença do cookie de sessão e redireciona para login se necessário
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar se a rota precisa de autenticação
  const protectedRoutes = ["/chat"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Verificar cookie de sessão
  const sessionToken = request.cookies.get("dengue_session_token");

  if (!sessionToken) {
    // Redirecionar para login com parâmetro 'from' para retornar após login
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Usuário autenticado, permitir acesso
  return NextResponse.next();
}

// Configurar quais rotas o proxy deve processar
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public assets)
     * - API routes (they handle auth themselves)
     */
    String.raw`/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)`,
  ],
};
