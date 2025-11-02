import type {
  MaintenanceRequest,
  MaintenanceRequestWithDetails,
  CreateMaintenanceRequestData,
  UpdateMaintenanceRequestData,
  MaintenanceFilters,
  MaintenanceStats,
} from '../types';
import { getApiClient } from './client';

export const maintenanceApi = {
  async getAll(filters?: MaintenanceFilters): Promise<MaintenanceRequest[]> {
    const client = getApiClient();
    return client.get<MaintenanceRequest[]>('/maintenance', filters);
  },

  async getById(id: number): Promise<MaintenanceRequestWithDetails> {
    const client = getApiClient();
    return client.get<MaintenanceRequestWithDetails>(`/maintenance/${id}`);
  },

  async getByTenant(tenantId: number): Promise<MaintenanceRequestWithDetails[]> {
    const client = getApiClient();
    return client.get<MaintenanceRequestWithDetails[]>(`/maintenance/tenant/${tenantId}`);
  },

  async getByUnit(unitId: number): Promise<MaintenanceRequestWithDetails[]> {
    const client = getApiClient();
    return client.get<MaintenanceRequestWithDetails[]>(`/maintenance/unit/${unitId}`);
  },

  async getAssigned(workerId: number): Promise<MaintenanceRequestWithDetails[]> {
    const client = getApiClient();
    return client.get<MaintenanceRequestWithDetails[]>(`/maintenance/assigned/${workerId}`);
  },

  async getStats(filters?: MaintenanceFilters): Promise<MaintenanceStats> {
    const client = getApiClient();
    return client.get<MaintenanceStats>('/maintenance/stats', filters);
  },

  async create(data: CreateMaintenanceRequestData): Promise<MaintenanceRequest> {
    const client = getApiClient();
    return client.post<MaintenanceRequest>('/maintenance', data);
  },

  async update(data: UpdateMaintenanceRequestData): Promise<MaintenanceRequest> {
    const client = getApiClient();
    const { id, ...updateData } = data;
    return client.put<MaintenanceRequest>(`/maintenance/${id}`, updateData);
  },

  async delete(id: number): Promise<void> {
    const client = getApiClient();
    return client.delete(`/maintenance/${id}`);
  },

  async updateStatus(id: number, status: string): Promise<MaintenanceRequest> {
    const client = getApiClient();
    return client.patch<MaintenanceRequest>(`/maintenance/${id}/status`, { status });
  },

  async assign(id: number, workerId: number): Promise<MaintenanceRequest> {
    const client = getApiClient();
    return client.post<MaintenanceRequest>(`/maintenance/${id}/assign`, { workerId });
  },

  async approve(id: number): Promise<MaintenanceRequest> {
    const client = getApiClient();
    return client.post<MaintenanceRequest>(`/maintenance/${id}/approve`);
  },

  async reject(id: number, reason: string): Promise<MaintenanceRequest> {
    const client = getApiClient();
    return client.post<MaintenanceRequest>(`/maintenance/${id}/reject`, { reason });
  },

  async complete(id: number, notes?: string): Promise<MaintenanceRequest> {
    const client = getApiClient();
    return client.post<MaintenanceRequest>(`/maintenance/${id}/complete`, { notes });
  },

  async uploadImage(requestId: number, imageFile: File): Promise<{ imageUrl: string }> {
    const client = getApiClient();
    const formData = new FormData();
    formData.append('image', imageFile);
    
    return client.post<{ imageUrl: string }>(`/maintenance/${requestId}/images`, formData);
  },
};
