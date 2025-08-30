import { User } from './user';
import { RentalUnit } from './property';

export interface MaintenanceRequest {
  id: number;
  rental_unit_id: number;
  tenant_id: number;
  landlord_id: number;
  request_type: 'routine' | 'urgent' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'assigned' | 'in_progress' | 'completed';
  estimated_cost?: number;
  actual_cost?: number;
  photos?: string[];
  created_at: string;
  updated_at: string;
  rental_unit?: RentalUnit;
  tenant?: User;
  landlord?: User;
  work_orders?: MaintenanceWorkOrder[];
}

export interface MaintenanceWorkOrder {
  id: number;
  maintenance_request_id: number;
  workman_id: number;
  title: string;
  description: string;
  estimated_hours: number;
  actual_hours?: number;
  status: 'assigned' | 'in_progress' | 'paused' | 'completed';
  assigned_at: string;
  started_at?: string;
  completed_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  maintenance_request?: MaintenanceRequest;
  workman?: User;
}

export interface MaintenanceApproval {
  id: number;
  maintenance_request_id: number;
  approver_id: number;
  status: 'approved' | 'rejected';
  comments?: string;
  approved_at: string;
  created_at: string;
  approver?: User;
}

export interface MaintenanceRating {
  id: number;
  maintenance_request_id: number;
  tenant_id: number;
  workman_id: number;
  rating: number; // 1-5 stars
  feedback?: string;
  created_at: string;
  tenant?: User;
  workman?: User;
}

export interface MaintenanceFilters {
  status?: string;
  request_type?: string;
  priority?: string;
  date_from?: string;
  date_to?: string;
  rental_unit_id?: number;
}
