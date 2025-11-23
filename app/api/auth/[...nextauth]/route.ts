import { NextRequest, NextResponse } from 'next/server';

/**
 * Placeholder para rotas de autenticação
 * Este endpoint será integrado com NextAuth.js ou CustomAuth no futuro
 * Por enquanto, retorna apenas dados mockados
 */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  // Mock de sessão
  if (action === 'session') {
    const sessionToken = request.cookies.get('dengue_session_token')?.value;

    if (sessionToken) {
      return NextResponse.json({
        user: {
          id: 'usr_123',
          name: 'Maria Silva',
          email: 'maria@example.com',
          avatar: 'https://github.com/shadcn.png',
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    return NextResponse.json(null);
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password, name } = body;

    // Mock de login
    if (action === 'login') {
      if (email === 'user@example.com' && password === 'SenhaForte!1') {
        const response = NextResponse.json({
          success: true,
          user: {
            id: 'usr_123',
            name: 'Maria Silva',
            email,
            avatar: 'https://github.com/shadcn.png',
          },
          sessionToken: 'mock-session-token-xyz',
          redirectTo: '/chat',
        });

        // Set cookie
        response.cookies.set('dengue_session_token', 'mock-session-token-xyz', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24, // 24 horas
        });

        return response;
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Credenciais inválidas',
          errorCode: 'INVALID_CREDENTIALS',
        },
        { status: 401 }
      );
    }

    // Mock de registro
    if (action === 'register') {
      if (email === 'exists@example.com') {
        return NextResponse.json(
          {
            success: false,
            error: 'Este e-mail já está em uso.',
            errorCode: 'EMAIL_TAKEN',
          },
          { status: 409 }
        );
      }

      const response = NextResponse.json({
        success: true,
        user: {
          id: `usr_${Date.now()}`,
          name,
          email,
        },
        sessionToken: 'mock-session-token-new-user',
        redirectTo: '/chat',
      });

      response.cookies.set('dengue_session_token', 'mock-session-token-new-user', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
      });

      return response;
    }

    // Mock de logout
    if (action === 'logout') {
      const response = NextResponse.json({ success: true });
      response.cookies.delete('dengue_session_token');
      return response;
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
