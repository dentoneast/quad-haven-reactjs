'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UnitForm } from '@/components/properties/UnitForm';
import { CreateUnitData } from '@homely-quad/shared/types';

export default function NewUnitPage() {
  const params = useParams();
  const { token } = useAuth();
  const propertyId = params.id as string;

  const handleSubmit = async (data: CreateUnitData) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/units`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create unit');
    }

    return await response.json();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Unit</h1>
          <p className="text-gray-600 mt-2">Create a new rental unit</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <UnitForm propertyId={propertyId} onSubmit={handleSubmit} submitLabel="Create Unit" />
        </div>
      </div>
    </div>
  );
}
