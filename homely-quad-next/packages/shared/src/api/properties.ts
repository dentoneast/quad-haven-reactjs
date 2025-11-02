import type {
  Property,
  PropertyWithOwner,
  CreatePropertyData,
  UpdatePropertyData,
  PropertyFilters,
  PaginatedResponse,
} from '../types';
import { getApiClient } from './client';

export const propertiesApi = {
  async getAll(filters?: PropertyFilters): Promise<Property[]> {
    const client = getApiClient();
    return client.get<Property[]>('/properties', filters);
  },

  async getPaginated(
    page: number = 1,
    limit: number = 10,
    filters?: PropertyFilters
  ): Promise<PaginatedResponse<Property>> {
    const client = getApiClient();
    return client.get<PaginatedResponse<Property>>('/properties/paginated', {
      page,
      limit,
      ...filters,
    });
  },

  async getById(id: number): Promise<PropertyWithOwner> {
    const client = getApiClient();
    return client.get<PropertyWithOwner>(`/properties/${id}`);
  },

  async getByOwner(ownerId: number): Promise<Property[]> {
    const client = getApiClient();
    return client.get<Property[]>(`/properties/owner/${ownerId}`);
  },

  async create(data: CreatePropertyData): Promise<Property> {
    const client = getApiClient();
    return client.post<Property>('/properties', data);
  },

  async update(data: UpdatePropertyData): Promise<Property> {
    const client = getApiClient();
    const { id, ...updateData } = data;
    return client.put<Property>(`/properties/${id}`, updateData);
  },

  async delete(id: number): Promise<void> {
    const client = getApiClient();
    return client.delete(`/properties/${id}`);
  },

  async uploadImage(propertyId: number, imageFile: File): Promise<{ imageUrl: string }> {
    const client = getApiClient();
    const formData = new FormData();
    formData.append('image', imageFile);
    
    return client.post<{ imageUrl: string }>(`/properties/${propertyId}/images`, formData);
  },

  async deleteImage(propertyId: number, imageUrl: string): Promise<void> {
    const client = getApiClient();
    return client.delete(`/properties/${propertyId}/images?url=${encodeURIComponent(imageUrl)}`);
  },
};
