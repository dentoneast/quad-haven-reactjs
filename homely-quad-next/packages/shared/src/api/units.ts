import type {
  Unit,
  UnitWithProperty,
  CreateUnitData,
  UpdateUnitData,
  UnitFilters,
} from '../types';
import { getApiClient } from './client';

export const unitsApi = {
  async getAll(filters?: UnitFilters): Promise<Unit[]> {
    const client = getApiClient();
    return client.get<Unit[]>('/units', filters);
  },

  async getById(id: number): Promise<UnitWithProperty> {
    const client = getApiClient();
    return client.get<UnitWithProperty>(`/units/${id}`);
  },

  async getByProperty(propertyId: number): Promise<Unit[]> {
    const client = getApiClient();
    return client.get<Unit[]>(`/units/property/${propertyId}`);
  },

  async getAvailable(filters?: UnitFilters): Promise<Unit[]> {
    const client = getApiClient();
    return client.get<Unit[]>('/units/available', filters);
  },

  async create(data: CreateUnitData): Promise<Unit> {
    const client = getApiClient();
    return client.post<Unit>('/units', data);
  },

  async update(data: UpdateUnitData): Promise<Unit> {
    const client = getApiClient();
    const { id, ...updateData } = data;
    return client.put<Unit>(`/units/${id}`, updateData);
  },

  async delete(id: number): Promise<void> {
    const client = getApiClient();
    return client.delete(`/units/${id}`);
  },

  async updateStatus(id: number, status: string): Promise<Unit> {
    const client = getApiClient();
    return client.patch<Unit>(`/units/${id}/status`, { status });
  },
};
