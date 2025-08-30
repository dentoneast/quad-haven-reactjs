export interface Premises {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  property_type: 'apartment' | 'house' | 'condo' | 'townhouse' | 'commercial';
  total_units: number;
  year_built?: number;
  amenities: string[];
  description?: string;
  lessor_id: number;
  organization_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RentalUnit {
  id: number;
  unit_number: string;
  premises_id: number;
  unit_type: string;
  square_feet: number;
  bedrooms: number;
  bathrooms: number;
  rent_amount: number;
  security_deposit: number;
  utilities_included: boolean;
  available_from: string;
  features: string[];
  images: string[];
  available: boolean;
  created_at: string;
  updated_at: string;
  premises?: Premises;
}

export interface RentalListing {
  id: number;
  rental_unit_id: number;
  title: string;
  description: string;
  monthly_rent: number;
  available_from: string;
  listing_status: 'active' | 'inactive' | 'rented';
  featured: boolean;
  contact_phone?: string;
  contact_email?: string;
  views_count: number;
  created_at: string;
  updated_at: string;
  rental_unit?: RentalUnit;
}

import { User } from './user';

export interface Lease {
  id: number;
  rental_unit_id: number;
  lessee_id: number;
  lessor_id: number;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  security_deposit: number;
  terms_conditions?: string;
  status: 'active' | 'expired' | 'terminated';
  created_at: string;
  updated_at: string;
  rental_unit?: RentalUnit;
  lessee?: User;
  lessor?: User;
}

export interface PropertySearchFilters {
  city?: string;
  state?: string;
  property_type?: string;
  min_rent?: number;
  max_rent?: number;
  bedrooms?: number;
  bathrooms?: number;
  available_from?: string;
  amenities?: string[];
}
