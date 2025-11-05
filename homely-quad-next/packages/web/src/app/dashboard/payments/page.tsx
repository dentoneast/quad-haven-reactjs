'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PaymentStats from '@/components/payments/PaymentStats';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';

export default function PaymentsDashboardPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    pending: 0,
    paid: 0,
    overdue: 0,
    cancelled: 0,
    total: 0,
    totalAmount: '0',
    paidAmount: '0',
    overdueAmount: '0',
    pendingAmount: '0',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchStats();
    }
  }, [token]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Payments Dashboard" description="Track rent payments and financial transactions">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Loading dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

  const isLandlord = user?.role === 'landlord' || user?.role === 'admin';

  return (
    <DashboardLayout title="Payments Dashboard" description="Track rent payments and financial transactions">
      <PaymentStats stats={stats} />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/payments/all"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">All Payments</h3>
          <p className="text-sm text-gray-600">View complete payment history</p>
        </Link>

        <Link
          href="/dashboard/payments/pending"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Payments</h3>
          <p className="text-sm text-gray-600">View unpaid rent and upcoming dues</p>
        </Link>

        <Link
          href="/dashboard/payments/overdue"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Overdue Payments</h3>
          <p className="text-sm text-gray-600">Track late and overdue payments</p>
        </Link>
      </div>

      {isLandlord && (
        <div className="mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Landlord Actions</h3>
            <p className="text-sm text-blue-700 mb-4">
              Create payment records or record received payments
            </p>
            <div className="flex gap-3">
              <Link href="/dashboard/payments/record">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Record Payment
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
