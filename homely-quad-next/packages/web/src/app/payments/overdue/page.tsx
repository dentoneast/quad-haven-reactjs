'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PaymentCard from '@/components/payments/PaymentCard';
import { AlertCircle } from 'lucide-react';

export default function OverduePaymentsPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchPayments();
    }
  }, [token]);

  const fetchPayments = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/overdue`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      }
    } catch (error) {
      console.error('Error fetching overdue payments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Overdue Payments" description="Late and overdue payments" showBackButton backHref="/payments">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Loading payments...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Overdue Payments" description="Late and overdue payments" showBackButton backHref="/payments">
      {payments.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Overdue Payments Alert</h3>
            <p className="text-sm text-red-700 mt-1">
              You have {payments.length} overdue payment{payments.length !== 1 ? 's' : ''} that require immediate attention.
            </p>
          </div>
        </div>
      )}

      {payments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No overdue payments - you're all caught up!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {payments.map((payment) => (
            <PaymentCard
              key={payment.id}
              payment={payment}
              onClick={() => router.push(`/payments/${payment.id}`)}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
