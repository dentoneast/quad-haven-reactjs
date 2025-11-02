'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Unit, CreateUnitData, UpdateUnitData } from '@homely-quad/shared/types';

interface UnitFormProps {
  propertyId: string;
  unit?: Unit;
  onSubmit: (data: CreateUnitData | UpdateUnitData) => Promise<void>;
  submitLabel?: string;
}

export function UnitForm({ propertyId, unit, onSubmit, submitLabel = 'Save Unit' }: UnitFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateUnitData>({
    propertyId: unit?.propertyId || propertyId,
    unitNumber: unit?.unitNumber || '',
    floor: unit?.floor || 0,
    bedrooms: unit?.bedrooms || 1,
    bathrooms: unit?.bathrooms || 1,
    squareFeet: unit?.squareFeet || 0,
    monthlyRent: unit?.monthlyRent ? parseFloat(unit.monthlyRent) : 0,
    securityDeposit: unit?.securityDeposit ? parseFloat(unit.securityDeposit) : 0,
    status: unit?.status || 'vacant',
    description: unit?.description || '',
  });

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
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save unit');
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
          <label htmlFor="unitNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Unit Number *
          </label>
          <input
            type="text"
            id="unitNumber"
            name="unitNumber"
            value={formData.unitNumber}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 101, A1, Suite 200"
          />
        </div>

        <div>
          <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-1">
            Floor *
          </label>
          <input
            type="number"
            id="floor"
            name="floor"
            value={formData.floor}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
            Bedrooms *
          </label>
          <input
            type="number"
            id="bedrooms"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
            Bathrooms *
          </label>
          <input
            type="number"
            id="bathrooms"
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            required
            min="0"
            step="0.5"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="squareFeet" className="block text-sm font-medium text-gray-700 mb-1">
            Square Feet
          </label>
          <input
            type="number"
            id="squareFeet"
            name="squareFeet"
            value={formData.squareFeet}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <option value="vacant">Vacant</option>
          <option value="occupied">Occupied</option>
          <option value="maintenance">Under Maintenance</option>
          <option value="reserved">Reserved</option>
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Additional details about the unit..."
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
