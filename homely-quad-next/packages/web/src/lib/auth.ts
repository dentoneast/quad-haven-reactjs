import type { UserRole } from '@homely-quad/shared/types';

export const hasRole = (userRole: UserRole | undefined, allowedRoles: UserRole[]): boolean => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};

export const isLandlord = (userRole: UserRole | undefined): boolean => {
  return userRole === 'landlord';
};

export const isTenant = (userRole: UserRole | undefined): boolean => {
  return userRole === 'tenant';
};

export const isWorkman = (userRole: UserRole | undefined): boolean => {
  return userRole === 'workman';
};

export const isAdmin = (userRole: UserRole | undefined): boolean => {
  return userRole === 'admin';
};

export const canManageProperties = (userRole: UserRole | undefined): boolean => {
  return hasRole(userRole, ['landlord', 'admin']);
};

export const canSubmitMaintenanceRequests = (userRole: UserRole | undefined): boolean => {
  return hasRole(userRole, ['tenant', 'landlord', 'admin']);
};

export const canApproveMaintenanceRequests = (userRole: UserRole | undefined): boolean => {
  return hasRole(userRole, ['landlord', 'admin']);
};

export const canAssignWorkOrders = (userRole: UserRole | undefined): boolean => {
  return hasRole(userRole, ['landlord', 'admin']);
};

export const canCompleteWorkOrders = (userRole: UserRole | undefined): boolean => {
  return hasRole(userRole, ['workman', 'landlord', 'admin']);
};

export const getRoleName = (role: UserRole | undefined): string => {
  const roleNames: Record<UserRole, string> = {
    tenant: 'Tenant',
    landlord: 'Landlord',
    workman: 'Workman',
    admin: 'Administrator',
  };
  return role ? roleNames[role] : 'Unknown';
};

export const getRoleColor = (role: UserRole | undefined): string => {
  const roleColors: Record<UserRole, string> = {
    tenant: 'blue',
    landlord: 'green',
    workman: 'orange',
    admin: 'purple',
  };
  return role ? roleColors[role] : 'gray';
};
