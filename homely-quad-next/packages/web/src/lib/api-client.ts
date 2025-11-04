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

  async request<T = any>(
    endpoint: string,
    method: string = 'GET',
    body?: any
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.getHeaders();

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
                
                const retryHeaders = this.getHeaders();
                const retryResponse = await fetch(url, {
                  method,
                  headers: retryHeaders,
                  body: body ? JSON.stringify(body) : undefined,
                });

                if (!retryResponse.ok) {
                  throw new Error('Request failed after token refresh');
                }

                return await retryResponse.json();
              } else {
                if (this.onAuthError) {
                  this.onAuthError();
                }
                throw new Error('Token refresh failed');
              }
            } catch (error) {
              if (this.onAuthError) {
                this.onAuthError();
              }
              throw error;
            }
          } else {
            if (this.onAuthError) {
              this.onAuthError();
            }
          }
        }

        const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error');
    }
  }

  async get<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, 'GET');
  }

  async post<T = any>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, 'POST', body);
  }

  async put<T = any>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, 'PUT', body);
  }

  async delete<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, 'DELETE');
  }
}

export function createApiClient(
  baseUrl: string,
  onAuthError?: () => void,
  onTokenRefresh?: (token: string, refreshToken: string) => void
): ApiClient {
  return new ApiClient(baseUrl, onAuthError, onTokenRefresh);
}
