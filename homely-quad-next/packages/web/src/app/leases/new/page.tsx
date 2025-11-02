'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LeaseForm } from '@/components/leases/LeaseForm';
import { CreateLeaseData } from '@homely-quad/shared/types';

export default function NewLeasePage() {
  const { token } = useAuth();

  const handleSubmit = async (data: CreateLeaseData) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create lease');
    }

    return await response.json();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Lease</h1>
          <p className="text-gray-600 mt-2">Set up a new lease agreement</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <LeaseForm onSubmit={handleSubmit} submitLabel="Create Lease" />
        </div>
      </div>
    </div>
  );
}
