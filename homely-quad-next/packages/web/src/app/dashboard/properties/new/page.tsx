'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PropertyForm } from '@/components/properties/PropertyForm';
import { CreatePropertyData } from '@homely-quad/shared/types';

export default function NewPropertyPage() {
  const { token } = useAuth();

  const handleSubmit = async (data: CreatePropertyData) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create property');
    }

    return await response.json();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
          <p className="text-gray-600 mt-2">Create a new property listing</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <PropertyForm onSubmit={handleSubmit} submitLabel="Create Property" />
        </div>
      </div>
    </div>
  );
}
