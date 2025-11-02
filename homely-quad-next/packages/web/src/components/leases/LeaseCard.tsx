'use client';

import React from 'react';
import Link from 'next/link';
import { Lease } from '@homely-quad/shared/types';
import { formatCurrency, formatDate } from '@homely-quad/shared/utils';

interface LeaseCardProps {
  lease: Lease & { 
    tenantName?: string; 
    propertyName?: string; 
    unitNumber?: string;
  };
}

export function LeaseCard({ lease }: LeaseCardProps) {
  return (
    <Link href={`/leases/${lease.id}`}>
      <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {lease.propertyName} - Unit {lease.unitNumber}
            </h3>
            <p className="text-sm text-gray-600">Tenant: {lease.tenantName || 'N/A'}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            lease.status === 'active' ? 'bg-green-100 text-green-800' :
            lease.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            lease.status === 'expired' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {lease.status}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <p className="text-gray-700">
            <span className="font-medium">Start Date:</span> {formatDate(new Date(lease.startDate))}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">End Date:</span> {formatDate(new Date(lease.endDate))}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Monthly Rent:</span> {formatCurrency(parseFloat(lease.monthlyRent))}
          </p>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Security Deposit: {formatCurrency(parseFloat(lease.securityDeposit))}
            </span>
            <span className="text-gray-600">
              Due Day: {lease.rentDueDay}th of month
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
