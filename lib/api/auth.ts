import { AuthResponse, LoginCredentials, RegisterCredentials } from '@/types/auth';

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/auth/nextauth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'login',
        ...credentials,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Erro ao fazer login',
        errorCode: data.errorCode,
      };
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Erro de conexão. Verifique sua internet.',
      errorCode: 'NETWORK_ERROR',
    };
  }
}

export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/auth/nextauth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'register',
        ...credentials,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Erro ao criar conta',
        errorCode: data.errorCode,
      };
    }

    return data;
  } catch (error) {
    console.error('Register error:', error);
    return {
      success: false,
      error: 'Erro de conexão. Verifique sua internet.',
      errorCode: 'NETWORK_ERROR',
    };
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch('/api/auth/nextauth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    localStorage.removeItem('dengue_session_token');
  } catch (_error) {
    console.error('Error logging out:', _error);
  }
}

export async function getSession() {
  try {
    const response = await fetch('/api/auth/nextauth?action=session');
    if (!response.ok) return null;
    return response.json();
  } catch (_error) {
    console.error('Error fetching session:', _error);
    return null;
  }
}

export async function forgotPassword(email: string): Promise<void> {
  // Mock API call simulation
  await new Promise((resolve) => setTimeout(resolve, 1500));
  // In a real app: await fetch('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
  console.log('Forgot password request for:', email);
}

export async function resetPassword(token: string, password: string): Promise<void> {
  // Mock API call simulation
  await new Promise((resolve) => setTimeout(resolve, 2000));
  // In a real app: await fetch('/api/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) });
  console.log('Reset password request with token:', token, 'and new password:', password);
}
