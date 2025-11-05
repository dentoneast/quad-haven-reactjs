'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function RecordPaymentLandingPage() {
  const router = useRouter();

  return (
    <DashboardLayout
      title="Record Payment"
      description="Record rent payment from tenant"
      showBackButton
      backHref="/payments"
    >
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Record Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900">How to Record a Payment</h3>
                <p className="text-sm text-blue-700 mt-2">
                  To record a payment, navigate to the specific payment you want to record:
                </p>
                <ol className="list-decimal list-inside text-sm text-blue-700 mt-2 space-y-1 ml-4">
                  <li>Go to "All Payments" or "Pending Payments"</li>
                  <li>Click on the payment you want to record</li>
                  <li>Click the "Record Payment" button</li>
                  <li>Fill in the payment details and submit</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
