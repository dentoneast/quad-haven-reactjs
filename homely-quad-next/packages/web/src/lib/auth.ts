export const hasRole = (userRole: string | undefined, allowedRoles: string[]): boolean => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};

export const isLandlord = (userRole: string | undefined): boolean => {
  return userRole === 'landlord';
};

export const isTenant = (userRole: string | undefined): boolean => {
  return userRole === 'tenant';
};

export const isWorkman = (userRole: string | undefined): boolean => {
  return userRole === 'workman';
};

export const isAdmin = (userRole: string | undefined): boolean => {
  return userRole === 'admin';
};

export const canManageProperties = (userRole: string | undefined): boolean => {
  return hasRole(userRole, ['landlord', 'admin']);
};

export const canSubmitMaintenanceRequests = (userRole: string | undefined): boolean => {
  return hasRole(userRole, ['tenant', 'landlord', 'admin']);
};

export const canApproveMaintenanceRequests = (userRole: string | undefined): boolean => {
  return hasRole(userRole, ['landlord', 'admin']);
};

export const canAssignWorkOrders = (userRole: string | undefined): boolean => {
  return hasRole(userRole, ['landlord', 'admin']);
};

export const canCompleteWorkOrders = (userRole: string | undefined): boolean => {
  return hasRole(userRole, ['workman', 'landlord', 'admin']);
};

export const getRoleName = (role: string | undefined): string => {
  if (!role) return 'Unknown';
  
  const roleNames: Record<string, string> = {
    tenant: 'Tenant',
    landlord: 'Landlord',
    workman: 'Workman',
    admin: 'Administrator',
  };
  return roleNames[role] || 'Unknown';
};

export const getRoleColor = (role: string | undefined): string => {
  if (!role) return 'gray';
  
  const roleColors: Record<string, string> = {
    tenant: 'blue',
    landlord: 'green',
    workman: 'orange',
    admin: 'purple',
  };
  return roleColors[role] || 'gray';
};
