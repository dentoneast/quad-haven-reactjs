import type {
  Payment,
  PaymentWithDetails,
  CreatePaymentData,
  RecordPaymentData,
  PaymentFilters,
  PaymentStats,
} from '../types';
import { getApiClient } from './client';

export const paymentsApi = {
  async getAll(filters?: PaymentFilters): Promise<Payment[]> {
    const client = getApiClient();
    return client.get<Payment[]>('/payments', filters);
  },

  async getById(id: number): Promise<PaymentWithDetails> {
    const client = getApiClient();
    return client.get<PaymentWithDetails>(`/payments/${id}`);
  },

  async getByLease(leaseId: number): Promise<PaymentWithDetails[]> {
    const client = getApiClient();
    return client.get<PaymentWithDetails[]>(`/payments/lease/${leaseId}`);
  },

  async getPending(tenantId?: number): Promise<PaymentWithDetails[]> {
    const client = getApiClient();
    const params = tenantId ? { tenantId } : undefined;
    return client.get<PaymentWithDetails[]>('/payments/pending', params);
  },

  async getOverdue(tenantId?: number): Promise<PaymentWithDetails[]> {
    const client = getApiClient();
    const params = tenantId ? { tenantId } : undefined;
    return client.get<PaymentWithDetails[]>('/payments/overdue', params);
  },

  async getStats(filters?: PaymentFilters): Promise<PaymentStats> {
    const client = getApiClient();
    return client.get<PaymentStats>('/payments/stats', filters);
  },

  async create(data: CreatePaymentData): Promise<Payment> {
    const client = getApiClient();
    return client.post<Payment>('/payments', data);
  },

  async recordPayment(data: RecordPaymentData): Promise<Payment> {
    const client = getApiClient();
    const { id, ...paymentData } = data;
    return client.post<Payment>(`/payments/${id}/record`, paymentData);
  },

  async delete(id: number): Promise<void> {
    const client = getApiClient();
    return client.delete(`/payments/${id}`);
  },

  async cancel(id: number, reason?: string): Promise<Payment> {
    const client = getApiClient();
    return client.post<Payment>(`/payments/${id}/cancel`, { reason });
  },
};
