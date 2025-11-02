export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: any;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestConfig {
  method?: RequestMethod;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, any>;
}
