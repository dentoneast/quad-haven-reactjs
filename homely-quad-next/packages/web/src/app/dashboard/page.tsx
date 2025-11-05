'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Home, Wrench, DollarSign, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout title={`Welcome back, ${user.firstName}!`}>
      <div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/properties">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Building2 className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Properties</CardTitle>
                <CardDescription>Manage your properties and listings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  View, create, and manage property listings
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/leases">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Home className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Leases</CardTitle>
                <CardDescription>Manage lease agreements</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Track active leases and rental agreements
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/maintenance">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Wrench className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle>Maintenance</CardTitle>
                <CardDescription>Handle maintenance requests</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Submit and track maintenance work orders
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/payments">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <DollarSign className="h-8 w-8 text-emerald-600 mb-2" />
                <CardTitle>Payments</CardTitle>
                <CardDescription>Track rent and payments</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  View payment history and upcoming dues
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/messages">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Messages</CardTitle>
                <CardDescription>Communication center</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Chat with tenants, landlords, and workmen
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Quick actions to get you started</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {user.role === 'landlord' && (
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Add Your First Property</h3>
                  <p className="text-sm text-gray-600">Start by adding a property to manage</p>
                </div>
                <Link href="/properties/new">
                  <Button>Add Property</Button>
                </Link>
              </div>
            )}
            {user.role === 'tenant' && (
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Browse Available Rentals</h3>
                  <p className="text-sm text-gray-600">Find your perfect home</p>
                </div>
                <Link href="/properties">
                  <Button>Browse</Button>
                </Link>
              </div>
            )}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Update Your Profile</h3>
                <p className="text-sm text-gray-600">Complete your profile information</p>
              </div>
              <Link href="/profile/edit">
                <Button variant="outline">Edit Profile</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
