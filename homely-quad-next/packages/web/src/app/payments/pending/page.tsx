'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PaymentCard from '@/components/payments/PaymentCard';

export default function PendingPaymentsPage() {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      }
    } catch (error) {
      console.error('Error fetching pending payments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Pending Payments" description="Unpaid rent and upcoming dues" showBackButton backHref="/payments">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Loading payments...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Pending Payments" description="Unpaid rent and upcoming dues" showBackButton backHref="/payments">
      {payments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No pending payments found</p>
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
