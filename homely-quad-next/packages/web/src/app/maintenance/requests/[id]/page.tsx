'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@homely-quad/shared/utils';
import { StatusTimeline } from '@/components/maintenance/StatusTimeline';

export default function MaintenanceRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token } = useAuth();
  const requestId = params.id as string;

  const [request, setRequest] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workmen, setWorkmen] = useState<any[]>([]);
  const [selectedWorkmanId, setSelectedWorkmanId] = useState<string>('');

  useEffect(() => {
    if (token && requestId) {
      fetchRequestDetails();
      fetchWorkmen();
    }
  }, [token, requestId]);

  const fetchRequestDetails = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/maintenance/${requestId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch request details');
      }

      const data = await response.json();
      setRequest(data);
      setSelectedWorkmanId(data.workmanId || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load request');
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkmen = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users?role=workman`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setWorkmen(data);
      }
    } catch (error) {
      console.error('Error fetching workmen:', error);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!confirm(`Are you sure you want to change the status to "${newStatus}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/maintenance/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      fetchRequestDetails();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const handleAssignWorkman = async () => {
    if (!selectedWorkmanId) {
      alert('Please select a workman');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/maintenance/${requestId}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ workmanId: selectedWorkmanId }),
      });

      if (!response.ok) {
        throw new Error('Failed to assign workman');
      }

      fetchRequestDetails();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to assign workman');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading request...</div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error || 'Request not found'}</div>
      </div>
    );
  }

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

  const isLandlord = user?.role === 'landlord';
  const isWorkman = user?.role === 'workman';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{request.title}</h1>
            <p className="text-gray-600 mt-2">
              {request.propertyName} {request.unitNumber && `- Unit ${request.unitNumber}`}
            </p>
          </div>
          <div className="flex gap-2">
            <span className={`px-4 py-2 rounded-lg text-sm font-medium ${statusColors[request.status]}`}>
              {request.status.replace('_', ' ')}
            </span>
            {request.priority && (
              <span className={`px-4 py-2 rounded-lg text-sm font-medium ${priorityColors[request.priority]}`}>
                {request.priority} priority
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Request Details</h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="mt-1 text-gray-900 capitalize">{request.category?.replace('_', ' ')}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Requested By</dt>
                  <dd className="mt-1 text-gray-900">{request.tenantName || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Requested On</dt>
                  <dd className="mt-1 text-gray-900">{formatDate(new Date(request.createdAt))}</dd>
                </div>
                {request.workmanName && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Assigned To</dt>
                    <dd className="mt-1 text-gray-900">{request.workmanName}</dd>
                  </div>
                )}
              </dl>
              <div className="mt-6">
                <dt className="text-sm font-medium text-gray-500 mb-2">Description</dt>
                <dd className="text-gray-900 whitespace-pre-wrap">{request.description}</dd>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Status Timeline</h2>
              <StatusTimeline
                events={[
                  { status: 'pending', timestamp: new Date(request.createdAt) },
                  ...(request.approvedAt ? [{ status: 'approved', timestamp: new Date(request.approvedAt) }] : []),
                  ...(request.startedAt ? [{ status: 'in_progress', timestamp: new Date(request.startedAt) }] : []),
                  ...(request.completedAt ? [{ status: 'completed', timestamp: new Date(request.completedAt) }] : []),
                ]}
                currentStatus={request.status}
              />
            </div>
          </div>

          <div className="space-y-6">
            {isLandlord && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Landlord Actions</h2>
                <div className="space-y-3">
                  {request.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate('approved')}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
                      >
                        Approve Request
                      </button>
                      <button
                        onClick={() => handleStatusUpdate('rejected')}
                        className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium"
                      >
                        Reject Request
                      </button>
                    </>
                  )}
                  {request.status === 'approved' && (
                    <div>
                      <label htmlFor="workman" className="block text-sm font-medium text-gray-700 mb-2">
                        Assign Workman
                      </label>
                      <select
                        id="workman"
                        value={selectedWorkmanId}
                        onChange={(e) => setSelectedWorkmanId(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                      >
                        <option value="">Select workman</option>
                        {workmen.map((workman) => (
                          <option key={workman.id} value={workman.id}>
                            {workman.firstName} {workman.lastName}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleAssignWorkman}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                      >
                        Assign Workman
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {isWorkman && request.workmanId === user?.id && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Workman Actions</h2>
                <div className="space-y-3">
                  {request.status === 'approved' && (
                    <button
                      onClick={() => handleStatusUpdate('in_progress')}
                      className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium"
                    >
                      Start Work
                    </button>
                  )}
                  {request.status === 'in_progress' && (
                    <button
                      onClick={() => handleStatusUpdate('completed')}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href={`/messages/new?recipientId=${request.tenantId}`}
                  className="block w-full bg-gray-200 text-gray-700 text-center px-4 py-2 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Message Tenant
                </Link>
                {request.workmanId && (
                  <Link
                    href={`/messages/new?recipientId=${request.workmanId}`}
                    className="block w-full bg-gray-200 text-gray-700 text-center px-4 py-2 rounded-lg hover:bg-gray-300 font-medium"
                  >
                    Message Workman
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
