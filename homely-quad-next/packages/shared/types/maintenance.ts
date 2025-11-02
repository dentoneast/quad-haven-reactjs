export type MaintenancePriority = 'low' | 'medium' | 'high' | 'critical' | 'emergency';
export type MaintenanceStatus = 'pending' | 'approved' | 'assigned' | 'in_progress' | 'completed' | 'cancelled' | 'rejected';
export type MaintenanceCategory = 'plumbing' | 'electrical' | 'hvac' | 'appliances' | 'structural' | 'pest_control' | 'landscaping' | 'other';

export interface MaintenanceRequest {
  id: number;
  unitId: number;
  tenantId: number;
  assignedTo: number | null;
  title: string;
  description: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  category: MaintenanceCategory | null;
  images: string[] | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

export interface CreateMaintenanceRequestData {
  unitId: number;
  title: string;
  description: string;
  priority?: MaintenancePriority;
  category?: MaintenanceCategory;
  images?: string[];
}

export interface UpdateMaintenanceRequestData {
  id: number;
  status?: MaintenanceStatus;
  priority?: MaintenancePriority;
  assignedTo?: number;
  category?: MaintenanceCategory;
  description?: string;
  title?: string;
}

export interface MaintenanceRequestWithDetails extends MaintenanceRequest {
  unit: {
    id: number;
    unitNumber: string;
    propertyId: number;
    property: {
      id: number;
      name: string;
      address: string;
    };
  };
  tenant: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  assignedWorker?: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
}

export interface MaintenanceFilters {
  unitId?: number;
  tenantId?: number;
  assignedTo?: number;
  status?: MaintenanceStatus;
  priority?: MaintenancePriority;
  category?: MaintenanceCategory;
}

export interface MaintenanceStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  byPriority: Record<MaintenancePriority, number>;
  byCategory: Record<MaintenanceCategory, number>;
}
