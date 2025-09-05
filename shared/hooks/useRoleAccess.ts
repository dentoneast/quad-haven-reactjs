import { useAuth } from './useAuth';

export interface RolePermissions {
  canViewProperties: boolean;
  canManageProperties: boolean;
  canCreateMaintenanceRequests: boolean;
  canManageMaintenanceRequests: boolean;
  canViewLeases: boolean;
  canManageLeases: boolean;
  canViewPayments: boolean;
  canManagePayments: boolean;
  canViewReports: boolean;
  canManageUsers: boolean;
}

export function useRoleAccess(): RolePermissions {
  const { user } = useAuth();

  const getRolePermissions = (userType: string): RolePermissions => {
    switch (userType) {
      case 'tenant':
        return {
          canViewProperties: true,
          canManageProperties: false,
          canCreateMaintenanceRequests: true,
          canManageMaintenanceRequests: false,
          canViewLeases: true,
          canManageLeases: false,
          canViewPayments: true,
          canManagePayments: false,
          canViewReports: false,
          canManageUsers: false,
        };
      case 'landlord':
        return {
          canViewProperties: true,
          canManageProperties: true,
          canCreateMaintenanceRequests: false,
          canManageMaintenanceRequests: true,
          canViewLeases: true,
          canManageLeases: true,
          canViewPayments: true,
          canManagePayments: true,
          canViewReports: true,
          canManageUsers: false,
        };
      case 'workman':
        return {
          canViewProperties: true,
          canManageProperties: false,
          canCreateMaintenanceRequests: false,
          canManageMaintenanceRequests: true,
          canViewLeases: false,
          canManageLeases: false,
          canViewPayments: false,
          canManagePayments: false,
          canViewReports: false,
          canManageUsers: false,
        };
      default:
        return {
          canViewProperties: false,
          canManageProperties: false,
          canCreateMaintenanceRequests: false,
          canManageMaintenanceRequests: false,
          canViewLeases: false,
          canManageLeases: false,
          canViewPayments: false,
          canManagePayments: false,
          canViewReports: false,
          canManageUsers: false,
        };
    }
  };

  return getRolePermissions(user?.user_type || '');
}

export function useRoleGuard(requiredPermission: keyof RolePermissions): boolean {
  const permissions = useRoleAccess();
  return permissions[requiredPermission];
}

