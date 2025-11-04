'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { User, LoginData, RegisterData } from '@homely-quad/shared/types';
import { createApiClient } from '../lib/api-client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginData) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const TOKEN_KEY = 'homely_quad_token';
const REFRESH_TOKEN_KEY = 'homely_quad_refresh_token';
const USER_KEY = 'homely_quad_user';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const handleTokenRefresh = (newToken: string, newRefreshToken: string) => {
    setToken(newToken);
    apiClient.setTokens(newToken, newRefreshToken);
    storeAuth(newToken, newRefreshToken, user!);
  };

  const apiClient = createApiClient(
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    () => {
      handleAuthError();
    },
    handleTokenRefresh
  );

  const handleAuthError = () => {
    clearAuth();
    router.push('/login');
  };

  const loadStoredAuth = () => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        apiClient.setTokens(storedToken, storedRefreshToken);
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const storeAuth = (newToken: string, refreshToken: string, newUser: User) => {
    try {
      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    } catch (error) {
      console.error('Error storing auth:', error);
    }
  };

  const clearAuth = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    apiClient.setTokens(null, null);
  };

  const login = async (credentials: LoginData) => {
    try {
      console.log('Attempting login with API URL:', process.env.NEXT_PUBLIC_API_URL);
      const response = await apiClient.post<{ token: string; refreshToken: string; user: User }>('/auth/login', credentials);
      
      setToken(response.token);
      setUser(response.user);
      apiClient.setTokens(response.token, response.refreshToken || null);
      storeAuth(response.token, response.refreshToken || '', response.user);
    } catch (error) {
      console.error('Login error details:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await apiClient.post<{ token: string; refreshToken: string; user: User }>('/auth/register', userData);
      
      setToken(response.token);
      setUser(response.user);
      apiClient.setTokens(response.token, response.refreshToken || null);
      storeAuth(response.token, response.refreshToken || '', response.user);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
      router.push('/login');
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const updatedUser = await apiClient.put<User>('/user/profile', data);
      setUser(updatedUser);
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const updatedUser = await apiClient.get<User>('/user/profile');
      setUser(updatedUser);
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Refresh user error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
