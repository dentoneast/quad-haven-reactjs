export const USER_ROLES = {
  TENANT: 'tenant',
  LANDLORD: 'landlord',
  WORKMAN: 'workman',
  ADMIN: 'admin',
} as const;

export const UNIT_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  MAINTENANCE: 'maintenance',
  UNAVAILABLE: 'unavailable',
} as const;

export const LEASE_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  EXPIRED: 'expired',
  TERMINATED: 'terminated',
  CANCELLED: 'cancelled',
} as const;

export const MAINTENANCE_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
  EMERGENCY: 'emergency',
} as const;

export const MAINTENANCE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected',
} as const;

export const MAINTENANCE_CATEGORY = {
  PLUMBING: 'plumbing',
  ELECTRICAL: 'electrical',
  HVAC: 'hvac',
  APPLIANCES: 'appliances',
  STRUCTURAL: 'structural',
  PEST_CONTROL: 'pest_control',
  LANDSCAPING: 'landscaping',
  OTHER: 'other',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  OVERDUE: 'overdue',
  PARTIAL: 'partial',
  CANCELLED: 'cancelled',
} as const;

export const PAYMENT_METHOD = {
  CASH: 'cash',
  CHECK: 'check',
  BANK_TRANSFER: 'bank_transfer',
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  ONLINE: 'online',
  OTHER: 'other',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  PROPERTIES: {
    BASE: '/properties',
    BY_OWNER: (ownerId: number) => `/properties/owner/${ownerId}`,
    BY_ID: (id: number) => `/properties/${id}`,
  },
  UNITS: {
    BASE: '/units',
    BY_PROPERTY: (propertyId: number) => `/units/property/${propertyId}`,
    BY_ID: (id: number) => `/units/${id}`,
    AVAILABLE: '/units/available',
  },
  LEASES: {
    BASE: '/leases',
    BY_TENANT: (tenantId: number) => `/leases/tenant/${tenantId}`,
    BY_UNIT: (unitId: number) => `/leases/unit/${unitId}`,
    BY_ID: (id: number) => `/leases/${id}`,
    ACTIVE: '/leases/active',
  },
  MAINTENANCE: {
    BASE: '/maintenance',
    BY_TENANT: (tenantId: number) => `/maintenance/tenant/${tenantId}`,
    BY_UNIT: (unitId: number) => `/maintenance/unit/${unitId}`,
    BY_ASSIGNED: (workerId: number) => `/maintenance/assigned/${workerId}`,
    BY_ID: (id: number) => `/maintenance/${id}`,
    STATS: '/maintenance/stats',
  },
  PAYMENTS: {
    BASE: '/payments',
    BY_LEASE: (leaseId: number) => `/payments/lease/${leaseId}`,
    BY_ID: (id: number) => `/payments/${id}`,
    PENDING: '/payments/pending',
    OVERDUE: '/payments/overdue',
    STATS: '/payments/stats',
  },
  MESSAGES: {
    BASE: '/messages',
    BY_ID: (id: number) => `/messages/${id}`,
    CONVERSATIONS: '/messages/conversations',
    WITH_USER: (userId: number) => `/messages/conversation/${userId}`,
    UNREAD_COUNT: '/messages/unread/count',
  },
} as const;
