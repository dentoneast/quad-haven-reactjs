'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PaymentForm from '@/components/payments/PaymentForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

export default function RecordPaymentPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const router = useRouter();
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (token && id) {
      fetchPayment();
    }
  }, [token, id]);

  const fetchPayment = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status !== 'pending') {
          router.push(`/payments/${id}`);
          return;
        }
        setPayment(data);
      } else {
        router.push('/payments');
      }
    } catch (error) {
      console.error('Error fetching payment:', error);
      router.push('/payments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: {
    paymentMethod: string;
    transactionId: string;
    paidDate: string;
    notes: string;
  }) => {
    setSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/${id}/record`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push(`/payments/${id}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to record payment');
      }
    } catch (error) {
      console.error('Error recording payment:', error);
      alert('Failed to record payment');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: string | number) => {
    return `$${parseFloat(amount.toString()).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <DashboardLayout title="Record Payment" showBackButton backHref={`/payments/${id}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!payment) {
    return null;
  }

  return (
    <DashboardLayout
      title="Record Payment"
      description={`Record payment for ${payment.property?.name || 'Payment'}`}
      showBackButton
      backHref={`/payments/${id}`}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Property</p>
                <p className="font-semibold">{payment.property?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Unit</p>
                <p className="font-semibold">Unit {payment.unit?.unitNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(payment.amount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Due Date</p>
                <p className="font-semibold">{formatDate(payment.dueDate)}</p>
              </div>
              {payment.tenant && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Tenant</p>
                  <p className="font-semibold">
                    {payment.tenant.firstName} {payment.tenant.lastName}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Record Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentForm
              onSubmit={handleSubmit}
              onCancel={() => router.push(`/payments/${id}`)}
              loading={submitting}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
