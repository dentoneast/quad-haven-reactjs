import { apiClient } from './client';
import { LoginCredentials, RegisterData, User } from '../types';

export interface AuthResponse {
  user: User;
  token: string;
}

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

  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>(`${this.basePath}/me`);
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return apiClient.put<User>(`/user/profile`, data);
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return apiClient.put<void>(`/user/change-password`, {
      currentPassword,
      newPassword,
    });
  }
}

export const authService = new AuthService();
