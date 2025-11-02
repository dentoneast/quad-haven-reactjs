'use client';

import React from 'react';
import Link from 'next/link';
import { MaintenanceRequest } from '@homely-quad/shared/types';
import { formatDate } from '@homely-quad/shared/utils';

interface RequestCardProps {
  request: MaintenanceRequest & {
    propertyName?: string;
    unitNumber?: string;
    tenantName?: string;
    workmanName?: string;
  };
}

export function RequestCard({ request }: RequestCardProps) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  };

  return (
    <Link href={`/maintenance/requests/${request.id}`}>
      <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{request.title}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {request.propertyName} {request.unitNumber && `- Unit ${request.unitNumber}`}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[request.status]}`}>
              {request.status.replace('_', ' ')}
            </span>
            {request.priority && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColors[request.priority]}`}>
                {request.priority}
              </span>
            )}
          </div>
        </div>

        <p className="text-gray-700 mb-4 line-clamp-2">{request.description}</p>

        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">Requested:</span>{' '}
              <span className="text-gray-900">{formatDate(new Date(request.createdAt))}</span>
            </div>
            {request.tenantName && (
              <div>
                <span className="text-gray-600">Tenant:</span>{' '}
                <span className="text-gray-900">{request.tenantName}</span>
              </div>
            )}
            {request.workmanName && (
              <div className="col-span-2">
                <span className="text-gray-600">Assigned to:</span>{' '}
                <span className="text-gray-900">{request.workmanName}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
