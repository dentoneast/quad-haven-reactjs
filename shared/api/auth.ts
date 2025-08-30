import { apiClient } from './client';
import { AuthResponse, LoginCredentials, RegisterData, UserProfile } from '../types';

export class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    if (response.success && response.data) {
      apiClient.setAuthToken(response.data.token);
      return response.data;
    }
    throw new Error(response.message || 'Login failed');
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    if (response.success && response.data) {
      apiClient.setAuthToken(response.data.token);
      return response.data;
    }
    throw new Error(response.message || 'Registration failed');
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      apiClient.clearAuthToken();
    }
  }

  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>('/auth/profile');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch profile');
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/refresh');
    if (response.success && response.data) {
      apiClient.setAuthToken(response.data.token);
      return response.data;
    }
    throw new Error(response.message || 'Token refresh failed');
  }

  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    const response = await apiClient.put<UserProfile>('/auth/profile', profileData);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Profile update failed');
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await apiClient.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    if (!response.success) {
      throw new Error(response.message || 'Password change failed');
    }
  }
}

export const authService = new AuthService();
export default authService;
