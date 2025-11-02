export type UnitStatus = 'available' | 'occupied' | 'maintenance' | 'unavailable';

export interface Unit {
  id: number;
  propertyId: number;
  unitNumber: string;
  bedrooms: number;
  bathrooms: string;
  squareFeet: number | null;
  rent: string;
  deposit: string | null;
  status: UnitStatus;
  description: string | null;
  amenities: string[] | null;
  images: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUnitData {
  propertyId: number;
  unitNumber: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet?: number;
  rent: number;
  deposit?: number;
  status?: UnitStatus;
  description?: string;
  amenities?: string[];
  images?: string[];
}

export interface UpdateUnitData extends Partial<CreateUnitData> {
  id: number;
}

export interface UnitWithProperty extends Unit {
  property: {
    id: number;
    name: string;
    address: string;
    city: string;
    state: string;
  };
}

export interface UnitFilters {
  propertyId?: number;
  status?: UnitStatus;
  minBedrooms?: number;
  maxBedrooms?: number;
  minRent?: number;
  maxRent?: number;
}
