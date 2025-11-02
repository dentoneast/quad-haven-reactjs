export interface Property {
  id: number;
  ownerId: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  description: string | null;
  propertyType: string;
  totalUnits: number;
  amenities: string[] | null;
  images: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePropertyData {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  description?: string;
  propertyType: string;
  totalUnits?: number;
  amenities?: string[];
  images?: string[];
}

export interface UpdatePropertyData extends Partial<CreatePropertyData> {
  id: number;
}

export interface PropertyWithOwner extends Property {
  owner: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
}

export interface PropertyFilters {
  city?: string;
  state?: string;
  propertyType?: string;
  minUnits?: number;
  maxUnits?: number;
}
