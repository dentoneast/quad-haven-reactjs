import { apiClient } from './client';
import { Property, Premises, RentalUnit, Lease, RentalListing, Organization } from '../types';

export class PropertyService {
  // Premises Management
  async getPremises(): Promise<Premises[]> {
    return apiClient.get<Premises[]>('/premises');
  }

  async getPremise(id: number): Promise<Premises> {
    return apiClient.get<Premises>(`/premises/${id}`);
  }

  async createPremise(premise: Omit<Premises, 'id' | 'created_at' | 'updated_at'>): Promise<Premises> {
    return apiClient.post<Premises>('/premises', premise);
  }

  async updatePremise(id: number, premise: Partial<Premises>): Promise<Premises> {
    return apiClient.put<Premises>(`/premises/${id}`, premise);
  }

  async deletePremise(id: number): Promise<void> {
    return apiClient.delete<void>(`/premises/${id}`);
  }

  // Rental Units Management
  async getRentalUnits(): Promise<RentalUnit[]> {
    return apiClient.get<RentalUnit[]>('/rental-units');
  }

  async getRentalUnit(id: number): Promise<RentalUnit> {
    return apiClient.get<RentalUnit>(`/rental-units/${id}`);
  }

  async createRentalUnit(unit: Omit<RentalUnit, 'id' | 'created_at' | 'updated_at'>): Promise<RentalUnit> {
    return apiClient.post<RentalUnit>('/rental-units', unit);
  }

  async updateRentalUnit(id: number, unit: Partial<RentalUnit>): Promise<RentalUnit> {
    return apiClient.put<RentalUnit>(`/rental-units/${id}`, unit);
  }

  async deleteRentalUnit(id: number): Promise<void> {
    return apiClient.delete<void>(`/rental-units/${id}`);
  }

  // Lease Management
  async getLeases(): Promise<Lease[]> {
    return apiClient.get<Lease[]>('/leases');
  }

  async getLease(id: number): Promise<Lease> {
    return apiClient.get<Lease>(`/leases/${id}`);
  }

  async createLease(lease: Omit<Lease, 'id' | 'created_at' | 'updated_at'>): Promise<Lease> {
    return apiClient.post<Lease>('/leases', lease);
  }

  async updateLease(id: number, lease: Partial<Lease>): Promise<Lease> {
    return apiClient.put<Lease>(`/leases/${id}`, lease);
  }

  async deleteLease(id: number): Promise<void> {
    return apiClient.delete<void>(`/leases/${id}`);
  }

  // Rental Listings Management
  async getRentalListings(): Promise<RentalListing[]> {
    return apiClient.get<RentalListing[]>('/rental-listings');
  }

  async getRentalListing(id: number): Promise<RentalListing> {
    return apiClient.get<RentalListing>(`/rental-listings/${id}`);
  }

  async createRentalListing(listing: Omit<RentalListing, 'id' | 'created_at' | 'updated_at'>): Promise<RentalListing> {
    return apiClient.post<RentalListing>('/rental-listings', listing);
  }

  async updateRentalListing(id: number, listing: Partial<RentalListing>): Promise<RentalListing> {
    return apiClient.put<RentalListing>(`/rental-listings/${id}`, listing);
  }

  async deleteRentalListing(id: number): Promise<void> {
    return apiClient.delete<void>(`/rental-listings/${id}`);
  }

  // Organization Management
  async getOrganization(id: number): Promise<Organization> {
    return apiClient.get<Organization>(`/organizations/${id}`);
  }

  async updateOrganization(id: number, organization: Partial<Organization>): Promise<Organization> {
    return apiClient.put<Organization>(`/organizations/${id}`, organization);
  }
}

export const propertyService = new PropertyService();