import { apiClient } from './client';
import { MaintenanceRequest, MaintenanceWorkOrder, MaintenanceApproval, MaintenancePhoto, MaintenanceNotification } from '../types';

export class MaintenanceService {
  // Maintenance Requests
  async getMaintenanceRequests(): Promise<MaintenanceRequest[]> {
    return apiClient.get<MaintenanceRequest[]>('/maintenance-requests');
  }

  async getMaintenanceRequest(id: number): Promise<MaintenanceRequest> {
    return apiClient.get<MaintenanceRequest>(`/maintenance-requests/${id}`);
  }

  async createMaintenanceRequest(request: Omit<MaintenanceRequest, 'id' | 'created_at' | 'updated_at'>): Promise<MaintenanceRequest> {
    return apiClient.post<MaintenanceRequest>('/maintenance-requests', request);
  }

  async updateMaintenanceRequest(id: number, request: Partial<MaintenanceRequest>): Promise<MaintenanceRequest> {
    return apiClient.put<MaintenanceRequest>(`/maintenance-requests/${id}`, request);
  }

  async deleteMaintenanceRequest(id: number): Promise<void> {
    return apiClient.delete<void>(`/maintenance-requests/${id}`);
  }

  // Maintenance Approvals
  async approveMaintenanceRequest(id: number, comments?: string): Promise<MaintenanceApproval> {
    return apiClient.put<MaintenanceApproval>(`/maintenance-requests/${id}/approve`, { comments });
  }

  async rejectMaintenanceRequest(id: number, comments: string): Promise<MaintenanceApproval> {
    return apiClient.put<MaintenanceApproval>(`/maintenance-requests/${id}/reject`, { comments });
  }

  // Work Orders
  async assignWorkOrder(requestId: number, workmanId: number, instructions: string): Promise<MaintenanceWorkOrder> {
    return apiClient.post<MaintenanceWorkOrder>(`/maintenance-requests/${requestId}/assign`, {
      workman_id: workmanId,
      instructions
    });
  }

  async getWorkOrders(): Promise<MaintenanceWorkOrder[]> {
    return apiClient.get<MaintenanceWorkOrder[]>('/work-orders');
  }

  async getWorkOrder(id: number): Promise<MaintenanceWorkOrder> {
    return apiClient.get<MaintenanceWorkOrder>(`/work-orders/${id}`);
  }

  async updateWorkOrderStatus(id: number, status: string, notes?: string): Promise<MaintenanceWorkOrder> {
    return apiClient.put<MaintenanceWorkOrder>(`/work-orders/${id}/status`, { status, notes });
  }

  // Maintenance Photos
  async uploadMaintenancePhoto(requestId: number, photo: File, description?: string): Promise<MaintenancePhoto> {
    const formData = new FormData();
    formData.append('photo', photo);
    if (description) {
      formData.append('description', description);
    }
    
    return apiClient.upload<MaintenancePhoto>(`/maintenance-requests/${requestId}/photos`, formData);
  }

  async getMaintenancePhotos(requestId: number): Promise<MaintenancePhoto[]> {
    return apiClient.get<MaintenancePhoto[]>(`/maintenance-requests/${requestId}/photos`);
  }

  // Notifications
  async getMaintenanceNotifications(): Promise<MaintenanceNotification[]> {
    return apiClient.get<MaintenanceNotification[]>('/maintenance-notifications');
  }

  async markNotificationAsRead(id: number): Promise<void> {
    return apiClient.put<void>(`/maintenance-notifications/${id}/read`);
  }

  // Landlord-specific endpoints
  async getLandlordPremises(): Promise<any[]> {
    return apiClient.get<any[]>('/landlord/premises');
  }

  async getLandlordTenants(): Promise<any[]> {
    return apiClient.get<any[]>('/landlord/tenants');
  }

  async createLandlordMaintenanceRequest(request: any): Promise<MaintenanceRequest> {
    return apiClient.post<MaintenanceRequest>('/landlord/maintenance-requests', request);
  }

  // Workman-specific endpoints
  async getWorkmanWorkOrders(): Promise<MaintenanceWorkOrder[]> {
    return apiClient.get<MaintenanceWorkOrder[]>('/workman/work-orders');
  }

  async getWorkmanDashboard(): Promise<any> {
    return apiClient.get<any>('/workman/dashboard');
  }
}

export const maintenanceService = new MaintenanceService();
