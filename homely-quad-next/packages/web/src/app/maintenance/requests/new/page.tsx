'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { RequestForm } from '@/components/maintenance/RequestForm';
import { CreateMaintenanceRequestData } from '@homely-quad/shared/types';

export default function NewMaintenanceRequestPage() {
  const { token } = useAuth();

  const handleSubmit = async (data: CreateMaintenanceRequestData) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/maintenance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create maintenance request');
    }

    return await response.json();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">New Maintenance Request</h1>
          <p className="text-gray-600 mt-2">Submit a maintenance request for your property</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <RequestForm onSubmit={handleSubmit} submitLabel="Submit Request" />
        </div>
      </div>
    </div>
  );
}
