import type { 
  User, 
  LoginCredentials, 
  RegisterData, 
  ChangePasswordData,
  AuthResponse,
  ApiResponse 
} from '../types';
import { getApiClient } from './client';

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const client = getApiClient();
    const response = await client.post<AuthResponse>('/auth/login', credentials);
    
    if (response.token) {
      client.setTokens(response.token, response.refreshToken);
    }
    
    return response;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const client = getApiClient();
    const response = await client.post<AuthResponse>('/auth/register', data);
    
    if (response.token) {
      client.setTokens(response.token, response.refreshToken);
    }
    
    return response;
  },

  async logout(): Promise<void> {
    const client = getApiClient();
    try {
      await client.post('/auth/logout');
    } finally {
      client.setTokens(null, null);
    }
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const client = getApiClient();
    const response = await client.post<AuthResponse>('/auth/refresh', { refreshToken });
    
    if (response.token) {
      client.setTokens(response.token, response.refreshToken);
    }
    
    return response;
  },

  async getProfile(): Promise<User> {
    const client = getApiClient();
    return client.get<User>('/auth/profile');
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const client = getApiClient();
    return client.put<User>('/auth/profile', data);
  },

  async changePassword(data: ChangePasswordData): Promise<ApiResponse> {
    const client = getApiClient();
    return client.put<ApiResponse>('/auth/change-password', data);
  },

  async requestPasswordReset(email: string): Promise<ApiResponse> {
    const client = getApiClient();
    return client.post<ApiResponse>('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse> {
    const client = getApiClient();
    return client.post<ApiResponse>('/auth/reset-password', { token, newPassword });
  },

  async verifyEmail(token: string): Promise<ApiResponse> {
    const client = getApiClient();
    return client.post<ApiResponse>('/auth/verify-email', { token });
  },
};
