'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Lease, CreateLeaseData, UpdateLeaseData } from '@homely-quad/shared/types';

interface LeaseFormProps {
  lease?: Lease;
  onSubmit: (data: CreateLeaseData | UpdateLeaseData) => Promise<void>;
  submitLabel?: string;
}

export function LeaseForm({ lease, onSubmit, submitLabel = 'Save Lease' }: LeaseFormProps) {
  const router = useRouter();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [properties, setProperties] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);

  const [formData, setFormData] = useState<CreateLeaseData>({
    unitId: lease?.unitId || '',
    tenantId: lease?.tenantId || '',
    startDate: lease?.startDate ? new Date(lease.startDate).toISOString().split('T')[0] : '',
    endDate: lease?.endDate ? new Date(lease.endDate).toISOString().split('T')[0] : '',
    monthlyRent: lease?.monthlyRent ? parseFloat(lease.monthlyRent) : 0,
    securityDeposit: lease?.securityDeposit ? parseFloat(lease.securityDeposit) : 0,
    rentDueDay: lease?.rentDueDay || 1,
    status: lease?.status || 'pending',
    terms: lease?.terms || '',
  });

  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');

  useEffect(() => {
    if (token) {
      fetchProperties();
      fetchTenants();
    }
  }, [token]);

  useEffect(() => {
    if (selectedPropertyId && token) {
      fetchUnits(selectedPropertyId);
    }
  }, [selectedPropertyId, token]);

  const fetchProperties = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const fetchUnits = async (propertyId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${propertyId}/units`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUnits(data);
      }
    } catch (error) {
      console.error('Error fetching units:', error);
    }
  };

  const fetchTenants = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users?role=tenant`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setTenants(data);
      }
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const processedValue = type === 'number' ? parseFloat(value) || 0 : value;
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
      router.push('/leases');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save lease');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="property" className="block text-sm font-medium text-gray-700 mb-1">
            Property *
          </label>
          <select
            id="property"
            value={selectedPropertyId}
            onChange={(e) => setSelectedPropertyId(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a property</option>
            {properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="unitId" className="block text-sm font-medium text-gray-700 mb-1">
            Unit *
          </label>
          <select
            id="unitId"
            name="unitId"
            value={formData.unitId}
            onChange={handleChange}
            required
            disabled={!selectedPropertyId}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">Select a unit</option>
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                Unit {unit.unitNumber} - Floor {unit.floor}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="tenantId" className="block text-sm font-medium text-gray-700 mb-1">
          Tenant *
        </label>
        <select
          id="tenantId"
          name="tenantId"
          value={formData.tenantId}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a tenant</option>
          {tenants.map((tenant) => (
            <option key={tenant.id} value={tenant.id}>
              {tenant.firstName} {tenant.lastName} ({tenant.email})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date *
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            End Date *
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="monthlyRent" className="block text-sm font-medium text-gray-700 mb-1">
            Monthly Rent *
          </label>
          <input
            type="number"
            id="monthlyRent"
            name="monthlyRent"
            value={formData.monthlyRent}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="securityDeposit" className="block text-sm font-medium text-gray-700 mb-1">
            Security Deposit
          </label>
          <input
            type="number"
            id="securityDeposit"
            name="securityDeposit"
            value={formData.securityDeposit}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="rentDueDay" className="block text-sm font-medium text-gray-700 mb-1">
            Rent Due Day
          </label>
          <input
            type="number"
            id="rentDueDay"
            name="rentDueDay"
            value={formData.rentDueDay}
            onChange={handleChange}
            min="1"
            max="31"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status *
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="terminated">Terminated</option>
        </select>
      </div>

      <div>
        <label htmlFor="terms" className="block text-sm font-medium text-gray-700 mb-1">
          Lease Terms
        </label>
        <textarea
          id="terms"
          name="terms"
          value={formData.terms}
          onChange={handleChange}
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter lease terms and conditions..."
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Saving...' : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
