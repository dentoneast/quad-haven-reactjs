'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { LeaseCard } from '@/components/leases/LeaseCard';

export default function LeasesPage() {
  const { token } = useAuth();
  const [leases, setLeases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (token) {
      fetchLeases();
    }
  }, [token]);

  const fetchLeases = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leases`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch leases');
      }

      const data = await response.json();
      setLeases(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leases');
    } finally {
      setLoading(false);
    }
  };

  const filteredLeases = leases.filter(lease => {
    return statusFilter === 'all' || lease.status === statusFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading leases...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leases</h1>
            <p className="text-gray-600 mt-2">Manage lease agreements</p>
          </div>
          <Link
            href="/leases/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            Create Lease
          </Link>
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Leases</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {filteredLeases.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 mb-4">No leases found.</p>
            <Link
              href="/leases/new"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Create your first lease
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLeases.map((lease) => (
              <LeaseCard key={lease.id} lease={lease} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
