export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  termsAccepted: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  sessionToken?: string;
  redirectTo?: string;
  error?: string;
  errorCode?: string;
}
