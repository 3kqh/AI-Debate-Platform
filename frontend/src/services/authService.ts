import api from './api';
import type { ApiResponse, AuthTokens, LoginRequest, RegisterRequest, User } from '@/types';

export const authService = {
  register(data: RegisterRequest) {
    return api.post<ApiResponse<AuthTokens & { user: User }>>('/auth/register', data);
  },

  login(data: LoginRequest) {
    return api.post<ApiResponse<AuthTokens & { user: User }>>('/auth/login', data);
  },

  logout() {
    return api.post('/auth/logout');
  },

  getMe() {
    return api.get<ApiResponse<User>>('/auth/me');
  },

  refreshToken(refreshToken: string) {
    return api.post<ApiResponse<AuthTokens>>('/auth/refresh-token', { refreshToken });
  },
};
