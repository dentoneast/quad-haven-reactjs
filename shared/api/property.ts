import { apiClient } from './client';
import { 
  Premises, 
  RentalUnit, 
  RentalListing, 
  Lease, 
  PropertySearchFilters,
  PaginatedResponse,
  PaginationParams 
} from '../types';

export class PropertyService {
  // Premises
  async getPremises(params?: PaginationParams): Promise<PaginatedResponse<Premises>> {
    const response = await apiClient.get<PaginatedResponse<Premises>>('/premises', { params });
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch premises');
  }

  async getPremisesById(id: number): Promise<Premises> {
    const response = await apiClient.get<Premises>(`/premises/${id}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch premises');
  }

  async createPremises(data: Omit<Premises, 'id' | 'created_at' | 'updated_at'>): Promise<Premises> {
    const response = await apiClient.post<Premises>('/premises', data);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to create premises');
  }

  async updatePremises(id: number, data: Partial<Premises>): Promise<Premises> {
    const response = await apiClient.put<Premises>(`/premises/${id}`, data);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update premises');
  }

  async deletePremises(id: number): Promise<void> {
    const response = await apiClient.delete(`/premises/${id}`);
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete premises');
    }
  }

  // Rental Units
  async getRentalUnits(params?: PaginationParams): Promise<PaginatedResponse<RentalUnit>> {
    const response = await apiClient.get<PaginatedResponse<RentalUnit>>('/rental-units', { params });
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch rental units');
  }

  async getRentalUnitById(id: number): Promise<RentalUnit> {
    const response = await apiClient.get<RentalUnit>(`/rental-units/${id}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch rental unit');
  }

  async createRentalUnit(data: Omit<RentalUnit, 'id' | 'created_at' | 'updated_at'>): Promise<RentalUnit> {
    const response = await apiClient.post<RentalUnit>('/rental-units', data);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to create rental unit');
  }

  async updateRentalUnit(id: number, data: Partial<RentalUnit>): Promise<RentalUnit> {
    const response = await apiClient.put<RentalUnit>(`/rental-units/${id}`, data);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update rental unit');
  }

  async deleteRentalUnit(id: number): Promise<void> {
    const response = await apiClient.delete(`/rental-units/${id}`);
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete rental unit');
    }
  }

  // Rental Listings
  async getRentalListings(filters?: PropertySearchFilters, params?: PaginationParams): Promise<PaginatedResponse<RentalListing>> {
    const queryParams = { ...filters, ...params };
    const response = await apiClient.get<PaginatedResponse<RentalListing>>('/rental-listings', { params: queryParams });
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch rental listings');
  }

  async getRentalListingById(id: number): Promise<RentalListing> {
    const response = await apiClient.get<RentalListing>(`/rental-listings/${id}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch rental listing');
  }

  async createRentalListing(data: Omit<RentalListing, 'id' | 'views_count' | 'created_at' | 'updated_at'>): Promise<RentalListing> {
    const response = await apiClient.post<RentalListing>('/rental-listings', data);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to create rental listing');
  }

  async updateRentalListing(id: number, data: Partial<RentalListing>): Promise<RentalListing> {
    const response = await apiClient.put<RentalListing>(`/rental-listings/${id}`, data);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update rental listing');
  }

  async deleteRentalListing(id: number): Promise<void> {
    const response = await apiClient.delete(`/rental-listings/${id}`);
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete rental listing');
    }
  }

  // Leases
  async getLeases(params?: PaginationParams): Promise<PaginatedResponse<Lease>> {
    const response = await apiClient.get<PaginatedResponse<Lease>>('/leases', { params });
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch leases');
  }

  async getLeaseById(id: number): Promise<Lease> {
    const response = await apiClient.get<Lease>(`/leases/${id}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch lease');
  }

  async createLease(data: Omit<Lease, 'id' | 'created_at' | 'updated_at'>): Promise<Lease> {
    const response = await apiClient.post<Lease>('/leases', data);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to create lease');
  }

  async updateLease(id: number, data: Partial<Lease>): Promise<Lease> {
    const response = await apiClient.put<Lease>(`/leases/${id}`, data);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update lease');
  }

  async deleteLease(id: number): Promise<void> {
    const response = await apiClient.delete(`/leases/${id}`);
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete lease');
    }
  }

  // Search and Filters
  async searchProperties(filters: PropertySearchFilters, params?: PaginationParams): Promise<PaginatedResponse<RentalListing>> {
    return this.getRentalListings(filters, params);
  }

  async getFeaturedListings(): Promise<RentalListing[]> {
    const response = await apiClient.get<RentalListing[]>('/rental-listings/featured');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch featured listings');
  }
}

export const propertyService = new PropertyService();
export default propertyService;
