'use client';

import React from 'react';
import Link from 'next/link';
import { Property } from '@homely-quad/shared/types';
import { formatCurrency } from '@homely-quad/shared/utils';

interface PropertyCardProps {
  property: Property & { ownerName?: string; unitCount?: number };
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/properties/${property.id}`}>
      <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{property.name}</h3>
            <p className="text-sm text-gray-600">{property.type}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            property.status === 'active' ? 'bg-green-100 text-green-800' :
            property.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {property.status}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <p className="text-gray-700">
            <span className="font-medium">Address:</span> {property.address}
          </p>
          {property.city && property.state && (
            <p className="text-gray-700">
              <span className="font-medium">Location:</span> {property.city}, {property.state} {property.zipCode}
            </p>
          )}
          {property.country && (
            <p className="text-gray-700">
              <span className="font-medium">Country:</span> {property.country}
            </p>
          )}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Units: {property.unitCount || 0}</span>
            <span className="text-gray-600">Owner: {property.ownerName || 'N/A'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
