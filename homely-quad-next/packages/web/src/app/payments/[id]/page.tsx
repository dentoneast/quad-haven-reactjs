'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, User, Home, Calendar, DollarSign, CreditCard, FileText } from 'lucide-react';
import Link from 'next/link';

export default function PaymentDetailPage() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const router = useRouter();
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: string | number) => {
    return `$${parseFloat(amount.toString()).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getStatusBadge = (status: string) => {
    const isOverdue = status === 'pending' && payment && new Date(payment.dueDate) < new Date();
    const displayStatus = isOverdue ? 'overdue' : status;
    
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      pending: { label: 'Pending', variant: 'secondary' },
      paid: { label: 'Paid', variant: 'default' },
      overdue: { label: 'Overdue', variant: 'destructive' },
      cancelled: { label: 'Cancelled', variant: 'outline' },
    };

    const config = statusConfig[displayStatus] || { label: displayStatus, variant: 'secondary' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <DashboardLayout title="Payment Details" showBackButton backHref="/payments">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Loading payment details...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!payment) {
    return null;
  }

  const isOverdue = payment.status === 'pending' && new Date(payment.dueDate) < new Date();
  const canRecordPayment = (user?.role === 'landlord' || user?.role === 'admin' || user?.role === 'tenant') && payment.status === 'pending';

  return (
    <DashboardLayout title="Payment Details" showBackButton backHref="/payments">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">Payment #{payment.id}</CardTitle>
                <p className="text-gray-600 mt-1">{payment.property?.name}</p>
              </div>
              {getStatusBadge(payment.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(payment.amount)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Due Date</p>
                  <p className={`text-lg font-semibold ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatDate(payment.dueDate)}
                  </p>
                </div>
              </div>

              {payment.paidDate && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Paid Date</p>
                    <p className="text-lg font-semibold text-green-600">{formatDate(payment.paidDate)}</p>
                  </div>
                </div>
              )}

              {payment.paymentMethod && (
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="text-lg font-semibold text-gray-900 capitalize">
                      {payment.paymentMethod.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>
              )}

              {payment.transactionId && (
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Transaction ID</p>
                    <p className="text-sm font-mono text-gray-900">{payment.transactionId}</p>
                  </div>
                </div>
              )}
            </div>

            {payment.notes && (
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Notes</p>
                <p className="text-sm text-gray-600">{payment.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Property & Lease Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {payment.property && (
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Property</p>
                  <p className="font-semibold text-gray-900">{payment.property.name}</p>
                  <p className="text-sm text-gray-600">
                    {payment.property.address}, {payment.property.city}, {payment.property.state}
                  </p>
                </div>
              </div>
            )}

            {payment.unit && (
              <div className="flex items-start gap-3">
                <Home className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Unit</p>
                  <p className="font-semibold text-gray-900">Unit {payment.unit.unitNumber}</p>
                  {payment.lease && (
                    <p className="text-sm text-gray-600">
                      Lease: {formatDate(payment.lease.startDate)} - {formatDate(payment.lease.endDate)}
                    </p>
                  )}
                </div>
              </div>
            )}

            {payment.tenant && (
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Tenant</p>
                  <p className="font-semibold text-gray-900">
                    {payment.tenant.firstName} {payment.tenant.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{payment.tenant.email}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {canRecordPayment && (
          <div className="flex justify-end">
            <Link href={`/payments/${payment.id}/record`}>
              <Button size="lg">Record Payment</Button>
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
