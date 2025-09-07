import { apiClient } from './client';
import { Property, PropertySearchFilters, SearchParams, PaginatedResponse } from '../types';

export class PropertyService {
  private readonly basePath = '/properties';

  async getProperties(params?: SearchParams): Promise<PaginatedResponse<Property>> {
    return apiClient.get<PaginatedResponse<Property>>(this.basePath, { params });
  }

  async getPropertyById(id: string): Promise<Property> {
    return apiClient.get<Property>(`${this.basePath}/${id}`);
  }

  async createProperty(property: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'owner'>): Promise<Property> {
    return apiClient.post<Property>(this.basePath, property);
  }

  async updateProperty(id: string, property: Partial<Property>): Promise<Property> {
    return apiClient.put<Property>(`${this.basePath}/${id}`, property);
  }

  async deleteProperty(id: string): Promise<void> {
    return apiClient.delete<void>(`${this.basePath}/${id}`);
  }

  async searchProperties(filters: PropertySearchFilters): Promise<PaginatedResponse<Property>> {
    return apiClient.post<PaginatedResponse<Property>>(`${this.basePath}/search`, filters);
  }

  async getFeaturedProperties(limit: number = 10): Promise<Property[]> {
    return apiClient.get<Property[]>(`${this.basePath}/featured`, { params: { limit } });
  }

  async getPropertiesByOwner(ownerId: string): Promise<Property[]> {
    return apiClient.get<Property[]>(`${this.basePath}/owner/${ownerId}`);
  }

  async uploadPropertyImages(propertyId: string, images: File[]): Promise<string[]> {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append(`images`, image);
    });
    
    return apiClient.upload<string[]>(`${this.basePath}/${propertyId}/images`, formData);
  }

  async deletePropertyImage(propertyId: string, imageUrl: string): Promise<void> {
    return apiClient.delete<void>(`${this.basePath}/${propertyId}/images`, {
      data: { imageUrl }
    });
  }

  async togglePropertyFavorite(propertyId: string): Promise<{ isFavorited: boolean }> {
    return apiClient.post<{ isFavorited: boolean }>(`${this.basePath}/${propertyId}/favorite`);
  }

  async getFavoriteProperties(): Promise<Property[]> {
    return apiClient.get<Property[]>(`${this.basePath}/favorites`);
  }

  async getPropertyStatistics(propertyId: string): Promise<{
    views: number;
    favorites: number;
    inquiries: number;
  }> {
    return apiClient.get<{
      views: number;
      favorites: number;
      inquiries: number;
    }>(`${this.basePath}/${propertyId}/stats`);
  }
}

export const propertyService = new PropertyService();
