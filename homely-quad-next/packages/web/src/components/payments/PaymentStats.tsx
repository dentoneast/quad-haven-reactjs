import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface PaymentStatsProps {
  stats: {
    pending: number;
    paid: number;
    overdue: number;
    cancelled: number;
    total: number;
    totalAmount: string;
    paidAmount: string;
    overdueAmount: string;
    pendingAmount: string;
  };
}

export default function PaymentStats({ stats }: PaymentStatsProps) {
  const formatCurrency = (amount: string | number) => {
    return `$${parseFloat(amount.toString()).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const statCards = [
    {
      title: 'Pending',
      value: stats.pending,
      amount: formatCurrency(stats.pendingAmount),
      icon: Clock,
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
    },
    {
      title: 'Paid',
      value: stats.paid,
      amount: formatCurrency(stats.paidAmount),
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      amount: formatCurrency(stats.overdueAmount),
      icon: AlertCircle,
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
    },
    {
      title: 'Total',
      value: stats.total,
      amount: formatCurrency(stats.totalAmount),
      icon: DollarSign,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.amount}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
