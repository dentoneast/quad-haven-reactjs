'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Building2, User, Home, ArrowLeft, ExternalLink } from 'lucide-react';
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

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Homely Quad</span>
              </Link>
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.href} className="flex items-center gap-2">
                    {index > 0 && <span>/</span>}
                    {index === breadcrumbs.length - 1 ? (
                      <span className="font-medium text-gray-900">{crumb.label}</span>
                    ) : (
                      <Link href={crumb.href} className="hover:text-blue-600">
                        {crumb.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-gray-500">{getRoleName(user.role)}</p>
              </div>
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <ExternalLink className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Public Site</span>
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Profile</span>
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6 overflow-x-auto">
            <Link
              href="/dashboard"
              className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                pathname === '/dashboard'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Home className="h-4 w-4 inline mr-1" />
              Home
            </Link>
            <Link
              href="/properties"
              className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                pathname.startsWith('/properties')
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Properties
            </Link>
            <Link
              href="/leases"
              className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                pathname.startsWith('/leases')
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Leases
            </Link>
            <Link
              href="/maintenance"
              className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                pathname.startsWith('/maintenance')
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Maintenance
            </Link>
            <Link
              href="/payments"
              className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                pathname.startsWith('/payments')
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Payments
            </Link>
            <Link
              href="/messages"
              className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                pathname.startsWith('/messages')
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Messages
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          {showBackButton && (
            <Link href={backHref} className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          )}
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {description && <p className="text-gray-600 mt-2">{description}</p>}
        </div>
        {children}
      </main>
    </div>
  );
}
