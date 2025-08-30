export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  user_type: 'tenant' | 'landlord' | 'workman' | 'admin';
  organization_id?: number;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends User {
  organization?: Organization;
  avatar_url?: string;
  is_verified: boolean;
  subscription_status?: 'active' | 'inactive' | 'expired';
}

export interface Organization {
  id: number;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  subscription_plan?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
  expires_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  user_type: 'tenant' | 'landlord' | 'workman';
  organization_name?: string;
  organization_description?: string;
}
