export type LeaseStatus = 'active' | 'pending' | 'expired' | 'terminated' | 'cancelled';

export interface Lease {
  id: number;
  unitId: number;
  tenantId: number;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  deposit: number | null;
  status: LeaseStatus;
  terms: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeaseData {
  unitId: number;
  tenantId: number;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  deposit?: number;
  status?: LeaseStatus;
  terms?: string;
}

export interface UpdateLeaseData extends Partial<CreateLeaseData> {
  id: number;
}

export interface LeaseWithDetails extends Lease {
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
    phone: string | null;
  };
}

export interface LeaseFilters {
  unitId?: number;
  tenantId?: number;
  status?: LeaseStatus;
  startDateFrom?: string;
  startDateTo?: string;
}
