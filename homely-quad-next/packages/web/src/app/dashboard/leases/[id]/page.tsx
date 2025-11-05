'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Lease } from '@homely-quad/shared/types';
import { formatCurrency, formatDate } from '@homely-quad/shared/utils';

export default function LeaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const leaseId = params.id as string;

  const [lease, setLease] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token && leaseId) {
      fetchLeaseDetails();
    }
  }, [token, leaseId]);

  const fetchLeaseDetails = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leases/${leaseId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch lease details');
      }

      const data = await response.json();
      setLease(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load lease');
    } finally {
      setLoading(false);
    }
  };

  const handleTerminate = async () => {
    if (!confirm('Are you sure you want to terminate this lease? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leases/${leaseId}/terminate`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to terminate lease');
      }

      fetchLeaseDetails();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to terminate lease');
    }
  };

  const handleRenew = async () => {
    const months = prompt('How many months to extend the lease?', '12');
    if (!months) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leases/${leaseId}/renew`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ months: parseInt(months) }),
      });

      if (!response.ok) {
        throw new Error('Failed to renew lease');
      }

      fetchLeaseDetails();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to renew lease');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading lease...</div>
      </div>
    );
  }

  if (error || !lease) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error || 'Lease not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lease Details</h1>
            <p className="text-gray-600 mt-2">
              {lease.propertyName} - Unit {lease.unitNumber}
            </p>
          </div>
          <div className="flex gap-4">
            {lease.status === 'active' && (
              <>
                <button
                  onClick={handleRenew}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium"
                >
                  Renew Lease
                </button>
                <button
                  onClick={handleTerminate}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 font-medium"
                >
                  Terminate
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Lease Information</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  lease.status === 'active' ? 'bg-green-100 text-green-800' :
                  lease.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  lease.status === 'expired' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {lease.status}
                </span>
              </div>

              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Property</dt>
                  <dd className="mt-1 text-gray-900">{lease.propertyName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Unit Number</dt>
                  <dd className="mt-1 text-gray-900">{lease.unitNumber}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Tenant</dt>
                  <dd className="mt-1 text-gray-900">{lease.tenantName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Tenant Email</dt>
                  <dd className="mt-1 text-gray-900">{lease.tenantEmail || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                  <dd className="mt-1 text-gray-900">{formatDate(new Date(lease.startDate))}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">End Date</dt>
                  <dd className="mt-1 text-gray-900">{formatDate(new Date(lease.endDate))}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Monthly Rent</dt>
                  <dd className="mt-1 text-gray-900">{formatCurrency(parseFloat(lease.monthlyRent))}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Security Deposit</dt>
                  <dd className="mt-1 text-gray-900">{formatCurrency(parseFloat(lease.securityDeposit))}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Rent Due Day</dt>
                  <dd className="mt-1 text-gray-900">{lease.rentDueDay}th of each month</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-gray-900">{formatDate(new Date(lease.createdAt))}</dd>
                </div>
              </dl>
            </div>

            {lease.terms && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Lease Terms & Conditions</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{lease.terms}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href={`/payments/record?leaseId=${leaseId}`}
                  className="block w-full bg-blue-600 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Record Payment
                </Link>
                <Link
                  href={`/maintenance/requests/new?leaseId=${leaseId}`}
                  className="block w-full bg-gray-200 text-gray-700 text-center px-4 py-2 rounded-lg hover:bg-gray-300 font-medium"
                >
                  New Maintenance Request
                </Link>
                <Link
                  href={`/messages/new?recipientId=${lease.tenantId}`}
                  className="block w-full bg-gray-200 text-gray-700 text-center px-4 py-2 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Message Tenant
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Lease Summary</h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm text-gray-500">Duration</dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {Math.ceil((new Date(lease.endDate).getTime() - new Date(lease.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} months
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Days Remaining</dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {Math.max(0, Math.ceil((new Date(lease.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Total Rent (Full Term)</dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {formatCurrency(parseFloat(lease.monthlyRent) * Math.ceil((new Date(lease.endDate).getTime() - new Date(lease.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30)))}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
