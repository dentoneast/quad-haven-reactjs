'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PaymentFormProps {
  onSubmit: (data: {
    paymentMethod: string;
    transactionId: string;
    paidDate: string;
    notes: string;
  }) => void;
  onCancel?: () => void;
  loading?: boolean;
  defaultValues?: {
    paymentMethod?: string;
    transactionId?: string;
    paidDate?: string;
    notes?: string;
  };
}

export default function PaymentForm({
  onSubmit,
  onCancel,
  loading = false,
  defaultValues = {},
}: PaymentFormProps) {
  const [formData, setFormData] = useState({
    paymentMethod: defaultValues.paymentMethod || 'bank_transfer',
    transactionId: defaultValues.transactionId || '',
    paidDate: defaultValues.paidDate || new Date().toISOString().split('T')[0],
    notes: defaultValues.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="paymentMethod">Payment Method</Label>
        <select
          id="paymentMethod"
          value={formData.paymentMethod}
          onChange={(e) => handleChange('paymentMethod', e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        >
          <option value="cash">Cash</option>
          <option value="check">Check</option>
          <option value="bank_transfer">Bank Transfer</option>
          <option value="credit_card">Credit Card</option>
          <option value="debit_card">Debit Card</option>
          <option value="online_payment">Online Payment</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="transactionId">Transaction ID / Reference Number</Label>
        <Input
          id="transactionId"
          type="text"
          value={formData.transactionId}
          onChange={(e) => handleChange('transactionId', e.target.value)}
          placeholder="Enter transaction ID or reference number"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="paidDate">Payment Date</Label>
        <Input
          id="paidDate"
          type="date"
          value={formData.paidDate}
          onChange={(e) => handleChange('paidDate', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Add any additional notes about this payment"
          rows={4}
        />
      </div>

      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Recording...' : 'Record Payment'}
        </Button>
      </div>
    </form>
  );
}
