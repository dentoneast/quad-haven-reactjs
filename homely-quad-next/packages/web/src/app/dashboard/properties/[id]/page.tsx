'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Property, Unit } from '@homely-quad/shared/types';
import { formatCurrency } from '@homely-quad/shared/utils';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<any | null>(null);
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token && propertyId) {
      fetchPropertyDetails();
    }
  }, [token, propertyId]);

  const fetchPropertyDetails = async () => {
    try {
      const [propertyResponse, unitsResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${propertyId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${propertyId}/units`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      if (!propertyResponse.ok || !unitsResponse.ok) {
        throw new Error('Failed to fetch property details');
      }

      const propertyData = await propertyResponse.json();
      const unitsData = await unitsResponse.json();

      setProperty(propertyData);
      setUnits(unitsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${propertyId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to delete property');
      }

      router.push('/properties');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete property');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading property...</div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error || 'Property not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{property.name}</h1>
            <p className="text-gray-600 mt-2">{property.address}</p>
          </div>
          <div className="flex gap-4">
            <Link
              href={`/properties/${propertyId}/edit`}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              Edit Property
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 font-medium"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Information</h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Type</dt>
                  <dd className="mt-1 text-gray-900 capitalize">{property.type}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      property.status === 'active' ? 'bg-green-100 text-green-800' :
                      property.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {property.status}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">City</dt>
                  <dd className="mt-1 text-gray-900">{property.city || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">State</dt>
                  <dd className="mt-1 text-gray-900">{property.state || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">ZIP Code</dt>
                  <dd className="mt-1 text-gray-900">{property.zipCode || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Country</dt>
                  <dd className="mt-1 text-gray-900">{property.country || 'N/A'}</dd>
                </div>
              </dl>
              {property.description && (
                <div className="mt-4">
                  <dt className="text-sm font-medium text-gray-500 mb-2">Description</dt>
                  <dd className="text-gray-900">{property.description}</dd>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Units ({units.length})</h2>
                <Link
                  href={`/properties/${propertyId}/units/new`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm"
                >
                  Add Unit
                </Link>
              </div>
              
              {units.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No units added yet.</p>
              ) : (
                <div className="space-y-4">
                  {units.map((unit) => (
                    <div key={unit.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">Unit {unit.unitNumber}</h3>
                          <p className="text-sm text-gray-600">Floor {unit.floor}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          unit.status === 'vacant' ? 'bg-green-100 text-green-800' :
                          unit.status === 'occupied' ? 'bg-blue-100 text-blue-800' :
                          unit.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {unit.status}
                        </span>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Bedrooms:</span> {unit.bedrooms}
                        </div>
                        <div>
                          <span className="text-gray-500">Bathrooms:</span> {unit.bathrooms}
                        </div>
                        <div>
                          <span className="text-gray-500">Rent:</span> {formatCurrency(parseFloat(unit.monthlyRent))}
                        </div>
                        <div>
                          <span className="text-gray-500">Sq Ft:</span> {unit.squareFeet || 'N/A'}
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Link
                          href={`/properties/${propertyId}/units/${unit.id}/edit`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href={`/leases/new?propertyId=${propertyId}`}
                  className="block w-full bg-blue-600 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Create Lease
                </Link>
                <Link
                  href={`/maintenance/requests/new?propertyId=${propertyId}`}
                  className="block w-full bg-gray-200 text-gray-700 text-center px-4 py-2 rounded-lg hover:bg-gray-300 font-medium"
                >
                  New Maintenance Request
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistics</h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm text-gray-500">Total Units</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{units.length}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Vacant Units</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {units.filter(u => u.status === 'vacant').length}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Occupied Units</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {units.filter(u => u.status === 'occupied').length}
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
