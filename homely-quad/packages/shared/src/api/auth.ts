import { apiClient } from './client';
import { AuthResponse, LoginCredentials, RegisterData, User } from '../types';

export class AuthService {
  private readonly basePath = '/auth';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(`${this.basePath}/login`, credentials);
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(`${this.basePath}/register`, data);
  }

  async logout(): Promise<void> {
    return apiClient.post<void>(`${this.basePath}/logout`);
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(`${this.basePath}/refresh`, { refreshToken });
  }

  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>(`${this.basePath}/me`);
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    return apiClient.put<User>(`${this.basePath}/profile/${userId}`, data);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    return apiClient.post<void>(`${this.basePath}/change-password`, {
      userId,
      currentPassword,
      newPassword,
    });
  }

  async requestPasswordReset(email: string): Promise<void> {
    return apiClient.post<void>(`${this.basePath}/forgot-password`, { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    return apiClient.post<void>(`${this.basePath}/reset-password`, { token, newPassword });
  }

  async verifyEmail(token: string): Promise<void> {
    return apiClient.post<void>(`${this.basePath}/verify-email`, { token });
  }

  async resendVerificationEmail(email: string): Promise<void> {
    return apiClient.post<void>(`${this.basePath}/resend-verification`, { email });
  }
}

export const authService = new AuthService();
