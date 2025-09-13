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
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  profile_image_url?: string;
  is_verified: boolean;
  user_type?: 'tenant' | 'landlord' | 'admin' | 'workman';
  created_at: string;
  updated_at?: string;
}

export enum UserRole {
  TENANT = 'tenant',
  LANDLORD = 'landlord',
  ADMIN = 'admin',
  WORKMAN = 'workman'
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
  phone?: string;
  dateOfBirth?: string;
  address?: string;
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

// Rental Property Management Types
export interface Premises {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  property_type: 'apartment' | 'house' | 'condo' | 'townhouse' | 'duplex' | 'studio';
  total_units: number;
  year_built: number;
  amenities: string[];
  description: string;
  lessor_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RentalUnit {
  id: number;
  unit_number: string;
  premises_id: number;
  unit_type: 'studio' | '1BR' | '2BR' | '3BR' | '4BR+';
  square_feet: number;
  bedrooms: number;
  bathrooms: number;
  floor_number: number;
  rent_amount: number;
  security_deposit: number;
  utilities_included: boolean;
  available_from: string;
  is_available: boolean;
  features: string[];
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface Lease {
  id: number;
  rental_unit_id: number;
  tenant_id: number;
  landlord_id: number;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  security_deposit: number;
  utilities_included: boolean;
  lease_terms: string;
  status: 'active' | 'expired' | 'terminated';
  created_at: string;
  updated_at: string;
}

export interface RentalListing {
  id: number;
  rental_unit_id: number;
  title: string;
  description: string;
  rent_amount: number;
  security_deposit: number;
  available_from: string;
  is_active: boolean;
  images: string[];
  features: string[];
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  subscription_plan: 'basic' | 'premium' | 'enterprise';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Maintenance System Types
export interface MaintenanceRequest {
  id: number;
  tenant_id: number;
  landlord_id: number;
  rental_unit_id: number;
  request_type: 'routine' | 'urgent' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'assigned' | 'in_progress' | 'completed';
  estimated_cost: number;
  actual_cost: number;
  photos: string[];
  created_at: string;
  updated_at: string;
}

export interface MaintenanceWorkOrder {
  id: number;
  maintenance_request_id: number;
  workman_id: number;
  title: string;
  description: string;
  instructions: string;
  estimated_hours: number;
  actual_hours: number;
  status: 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  assigned_at: string;
  started_at: string;
  completed_at: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceApproval {
  id: number;
  maintenance_request_id: number;
  landlord_id: number;
  status: 'approved' | 'rejected';
  comments: string;
  approved_at: string;
  created_at: string;
}

export interface MaintenancePhoto {
  id: number;
  maintenance_request_id: number;
  photo_url: string;
  description: string;
  uploaded_by: number;
  created_at: string;
}

export interface MaintenanceNotification {
  id: number;
  user_id: number;
  maintenance_request_id: number;
  type: 'request_created' | 'request_approved' | 'request_rejected' | 'work_assigned' | 'work_completed';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// Chat and Messaging Types
export interface Conversation {
  id: number;
  title: string;
  type: 'direct' | 'group';
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface ConversationParticipant {
  id: number;
  conversation_id: number;
  user_id: number;
  joined_at: string;
  last_read_at: string;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  message_type: 'text' | 'image' | 'file';
  is_read: boolean;
  created_at: string;
  updated_at: string;
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
export type Platform = 'web' | 'ios' | 'android';

export interface PlatformInfo {
  isWeb: boolean;
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  platform: Platform;
}

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

// Responsive Design Types
export const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

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
