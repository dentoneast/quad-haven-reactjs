export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'partial' | 'cancelled';
export type PaymentMethod = 'cash' | 'check' | 'bank_transfer' | 'credit_card' | 'debit_card' | 'online' | 'other';

export interface Payment {
  id: number;
  leaseId: number;
  amount: number;
  dueDate: string;
  paidDate: string | null;
  status: PaymentStatus;
  paymentMethod: PaymentMethod | null;
  transactionId: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentData {
  leaseId: number;
  amount: number;
  dueDate: string;
  status?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  notes?: string;
}

export interface RecordPaymentData {
  id: number;
  paidDate: string;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  notes?: string;
}

export interface PaymentWithDetails extends Payment {
  lease: {
    id: number;
    unitId: number;
    tenantId: number;
    unit: {
      id: number;
      unitNumber: string;
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
  };
}

export interface PaymentFilters {
  leaseId?: number;
  status?: PaymentStatus;
  dueDateFrom?: string;
  dueDateTo?: string;
}

export interface PaymentStats {
  total: number;
  paid: number;
  pending: number;
  overdue: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
}
