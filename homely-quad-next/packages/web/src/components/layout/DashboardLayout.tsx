'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  User, 
  Home, 
  ArrowLeft, 
  HomeIcon,
  LayoutDashboard,
  Building,
  FileText,
  Wrench,
  DollarSign,
  MessageSquare,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { getRoleName } from '@/lib/auth';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  showBackButton?: boolean;
  backHref?: string;
}

export default function DashboardLayout({
  children,
  title,
  description,
  showBackButton = false,
  backHref = '/dashboard',
}: DashboardLayoutProps) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-blue-600 mx-auto animate-pulse" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Dashboard', href: '/dashboard' }];
    
    let currentPath = '';
    paths.forEach((path, index) => {
      if (path !== 'dashboard') {
        currentPath += `/${path}`;
        const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
        breadcrumbs.push({ label, href: currentPath });
      }
    });

    return breadcrumbs;
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      active: pathname === '/dashboard',
    },
    {
      name: 'Properties',
      href: '/properties',
      icon: Building,
      active: pathname.startsWith('/properties'),
    },
    {
      name: 'Leases',
      href: '/leases',
      icon: FileText,
      active: pathname.startsWith('/leases'),
    },
    {
      name: 'Maintenance',
      href: '/maintenance',
      icon: Wrench,
      active: pathname.startsWith('/maintenance'),
    },
    {
      name: 'Payments',
      href: '/payments',
      icon: DollarSign,
      active: pathname.startsWith('/payments'),
    },
    {
      name: 'Messages',
      href: '/messages',
      icon: MessageSquare,
      active: pathname.startsWith('/messages'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 left-0">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Homely Quad</span>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-gray-200"></div>

          {/* Public Home Link */}
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <HomeIcon className="h-5 w-5" />
            Public Home
          </Link>
        </nav>

        {/* Sidebar Footer - User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{getRoleName(user.role)}</p>
            </div>
          </div>
          <div className="space-y-1">
            <Button variant="outline" size="sm" className="w-full justify-start" asChild>
              <Link href="/profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
              </div>
              {showBackButton && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href={backHref}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
