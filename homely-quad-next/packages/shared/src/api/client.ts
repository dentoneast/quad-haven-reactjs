import type { ApiResponse, ApiError, RequestConfig } from '../types';

export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;
  private refreshToken: string | null = null;
  private onAuthError?: () => void;
  private onTokenRefresh?: (token: string, refreshToken: string) => void;

  constructor(
    baseUrl: string,
    onAuthError?: () => void,
    onTokenRefresh?: (token: string, refreshToken: string) => void
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.onAuthError = onAuthError;
    this.onTokenRefresh = onTokenRefresh;
  }

  setTokens(token: string | null, refreshToken: string | null = null) {
    this.token = token;
    this.refreshToken = refreshToken;
  }

  getToken(): string | null {
    return this.token;
  }

  private getHeaders(customHeaders?: Record<string, string>): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = `${this.baseUrl}${endpoint}`;
    
    if (!params || Object.keys(params).length === 0) {
      return url;
    }

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `${url}?${queryString}` : url;
  }

  async request<T = any>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const {
      method = 'GET',
      headers: customHeaders,
      body,
      params,
    } = config;

    const url = this.buildUrl(endpoint, params);
    const headers = this.getHeaders(customHeaders);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        if (response.status === 401) {
          if (this.refreshToken) {
            try {
              const refreshResponse = await fetch(`${this.baseUrl}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: this.refreshToken }),
              });

              if (refreshResponse.ok) {
                const refreshData = await refreshResponse.json();
                this.setTokens(refreshData.token, refreshData.refreshToken);
                
                if (this.onTokenRefresh) {
                  this.onTokenRefresh(refreshData.token, refreshData.refreshToken);
                }
                
                const retryHeaders = this.getHeaders(customHeaders);
                const retryResponse = await fetch(url, {
                  method,
                  headers: retryHeaders,
                  body: body ? JSON.stringify(body) : undefined,
                });

                if (retryResponse.ok) {
                  const contentType = retryResponse.headers.get('content-type');
                  if (retryResponse.status === 204 || !contentType?.includes('application/json')) {
                    return {} as T;
                  }
                  return await retryResponse.json();
                }
              }
            } catch {
              this.onAuthError?.();
            }
          }
          this.onAuthError?.();
        }

        const contentType = response.headers.get('content-type');
        let errorData: any = {};
        
        if (contentType?.includes('application/json')) {
          errorData = await response.json();
        }

        const error: ApiError = {
          message: errorData.error || errorData.message || 'Request failed',
          code: errorData.code || 'API_ERROR',
          statusCode: response.status,
          errors: errorData.errors,
        };
        throw error;
      }

      const contentType = response.headers.get('content-type');
      if (response.status === 204 || !contentType?.includes('application/json')) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error) {
        throw error;
      }

      const apiError: ApiError = {
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
        statusCode: 0,
      };
      throw apiError;
    }
  }

  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  async post<T = any>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body });
  }

  async put<T = any>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body });
  }

  async patch<T = any>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body });
  }

  async delete<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

let apiClientInstance: ApiClient | null = null;

export function createApiClient(
  baseUrl: string,
  onAuthError?: () => void,
  onTokenRefresh?: (token: string, refreshToken: string) => void
): ApiClient {
  apiClientInstance = new ApiClient(baseUrl, onAuthError, onTokenRefresh);
  return apiClientInstance;
}

export function getApiClient(): ApiClient {
  if (!apiClientInstance) {
    throw new Error('API client not initialized. Call createApiClient first.');
  }
  return apiClientInstance;
}
