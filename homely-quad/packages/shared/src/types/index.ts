// Common types
export interface ApiResponse<T = any> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
  details?: Record<string, any>;
}

// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator'
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// Property types
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  location: Location;
  images: string[];
  features: PropertyFeature[];
  type: PropertyType;
  status: PropertyStatus;
  owner: User;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface PropertyFeature {
  id: string;
  name: string;
  value: string | number | boolean;
  category: FeatureCategory;
}

export enum PropertyType {
  APARTMENT = 'apartment',
  HOUSE = 'house',
  CONDO = 'condo',
  STUDIO = 'studio',
  TOWNHOUSE = 'townhouse'
}

export enum PropertyStatus {
  AVAILABLE = 'available',
  RENTED = 'rented',
  MAINTENANCE = 'maintenance',
  UNAVAILABLE = 'unavailable'
}

export enum FeatureCategory {
  BASIC = 'basic',
  AMENITIES = 'amenities',
  UTILITIES = 'utilities',
  SAFETY = 'safety'
}

// Search and filter types
export interface PropertySearchFilters {
  minPrice?: number;
  maxPrice?: number;
  propertyType?: PropertyType[];
  location?: string;
  features?: string[];
  availability?: Date;
}

export interface SearchParams {
  query?: string;
  filters?: PropertySearchFilters;
  sortBy?: SortOption;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export enum SortOption {
  PRICE = 'price',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  TITLE = 'title'
}

// Platform types
export type Platform = 'web' | 'mobile';

export interface PlatformConfig {
  platform: Platform;
  apiBaseUrl: string;
  storageKey: string;
  features: {
    pushNotifications: boolean;
    camera: boolean;
    location: boolean;
    biometrics: boolean;
  };
}

// Theme types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    warning: string;
    success: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'date';
  required: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}
