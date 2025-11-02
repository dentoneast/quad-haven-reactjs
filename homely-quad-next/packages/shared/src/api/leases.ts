import type {
  Lease,
  LeaseWithDetails,
  CreateLeaseData,
  UpdateLeaseData,
  LeaseFilters,
} from '../types';
import { getApiClient } from './client';

export const leasesApi = {
  async getAll(filters?: LeaseFilters): Promise<Lease[]> {
    const client = getApiClient();
    return client.get<Lease[]>('/leases', filters);
  },

  async getById(id: number): Promise<LeaseWithDetails> {
    const client = getApiClient();
    return client.get<LeaseWithDetails>(`/leases/${id}`);
  },

  async getByTenant(tenantId: number): Promise<LeaseWithDetails[]> {
    const client = getApiClient();
    return client.get<LeaseWithDetails[]>(`/leases/tenant/${tenantId}`);
  },

  async getByUnit(unitId: number): Promise<LeaseWithDetails[]> {
    const client = getApiClient();
    return client.get<LeaseWithDetails[]>(`/leases/unit/${unitId}`);
  },

  async getActive(tenantId?: number): Promise<LeaseWithDetails[]> {
    const client = getApiClient();
    const params = tenantId ? { tenantId } : undefined;
    return client.get<LeaseWithDetails[]>('/leases/active', params);
  },

  async create(data: CreateLeaseData): Promise<Lease> {
    const client = getApiClient();
    return client.post<Lease>('/leases', data);
  },

  async update(data: UpdateLeaseData): Promise<Lease> {
    const client = getApiClient();
    const { id, ...updateData } = data;
    return client.put<Lease>(`/leases/${id}`, updateData);
  },

  async delete(id: number): Promise<void> {
    const client = getApiClient();
    return client.delete(`/leases/${id}`);
  },

  async terminate(id: number, reason?: string): Promise<Lease> {
    const client = getApiClient();
    return client.post<Lease>(`/leases/${id}/terminate`, { reason });
  },

  async renew(id: number, newEndDate: string): Promise<Lease> {
    const client = getApiClient();
    return client.post<Lease>(`/leases/${id}/renew`, { newEndDate });
  },
};
