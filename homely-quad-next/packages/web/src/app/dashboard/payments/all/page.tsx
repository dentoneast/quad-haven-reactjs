'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PaymentCard from '@/components/payments/PaymentCard';
import { Button } from '@/components/ui/button';

export default function AllPaymentsPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (token) {
      fetchPayments();
    }
  }, [token, filter]);

  const fetchPayments = async () => {
    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/payments`);
      if (filter !== 'all') {
        url.searchParams.set('status', filter);
      }

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="All Payments" description="Complete payment history" showBackButton backHref="/payments">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Loading payments...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="All Payments" description="Complete payment history" showBackButton backHref="/payments">
      <div className="mb-6 flex flex-wrap gap-3">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilter('pending')}
        >
          Pending
        </Button>
        <Button
          variant={filter === 'paid' ? 'default' : 'outline'}
          onClick={() => setFilter('paid')}
        >
          Paid
        </Button>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No payments found</p>
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
