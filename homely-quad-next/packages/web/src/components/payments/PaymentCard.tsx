import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, User, Building2 } from 'lucide-react';

interface PaymentCardProps {
  payment: {
    id: number;
    amount: string;
    dueDate: Date | string;
    paidDate?: Date | string | null;
    status: string;
    paymentMethod?: string | null;
    transactionId?: string | null;
    lease?: {
      id: number;
      monthlyRent: string;
    };
    unit?: {
      id: number;
      unitNumber: string;
    };
    property?: {
      id: number;
      name: string;
      address: string;
    };
    tenant?: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  onClick?: () => void;
}

export default function PaymentCard({ payment, onClick }: PaymentCardProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      pending: { label: 'Pending', variant: 'secondary' },
      paid: { label: 'Paid', variant: 'default' },
      overdue: { label: 'Overdue', variant: 'destructive' },
      cancelled: { label: 'Cancelled', variant: 'outline' },
    };

    const config = statusConfig[status] || { label: status, variant: 'secondary' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const isOverdue = payment.status === 'pending' && new Date(payment.dueDate) < new Date();

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: string | number) => {
    return `$${parseFloat(amount.toString()).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <Card
      className={`hover:shadow-lg transition-shadow ${onClick ? 'cursor-pointer' : ''} ${
        isOverdue ? 'border-red-300' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
            {payment.property?.name || 'Payment'}
          </CardTitle>
          {getStatusBadge(isOverdue ? 'overdue' : payment.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm">Amount</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {formatCurrency(payment.amount)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Due Date</span>
            </div>
            <span className={isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}>
              {formatDate(payment.dueDate)}
            </span>
          </div>

          {payment.paidDate && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Paid Date</span>
              </div>
              <span className="text-green-600 font-medium">{formatDate(payment.paidDate)}</span>
            </div>
          )}

          {payment.unit && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 className="h-4 w-4" />
              <span>Unit {payment.unit.unitNumber}</span>
            </div>
          )}

          {payment.tenant && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>
                {payment.tenant.firstName} {payment.tenant.lastName}
              </span>
            </div>
          )}

          {payment.paymentMethod && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Method:</span> {payment.paymentMethod}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
