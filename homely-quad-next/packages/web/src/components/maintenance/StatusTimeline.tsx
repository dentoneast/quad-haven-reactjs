'use client';

import React from 'react';
import { formatDate } from '@homely-quad/shared/utils';

interface TimelineEvent {
  status: string;
  timestamp: Date;
  note?: string;
}

interface StatusTimelineProps {
  events: TimelineEvent[];
  currentStatus: string;
}

export function StatusTimeline({ events, currentStatus }: StatusTimelineProps) {
  const statusOrder = ['pending', 'approved', 'in_progress', 'completed'];
  const statusLabels = {
    pending: 'Submitted',
    approved: 'Approved',
    in_progress: 'In Progress',
    completed: 'Completed',
    rejected: 'Rejected',
  };

  const currentIndex = statusOrder.indexOf(currentStatus);

  return (
    <div className="space-y-4">
      {statusOrder.map((status, index) => {
        const event = events.find(e => e.status === status);
        const isActive = index <= currentIndex;
        const isCurrent = status === currentStatus;
        const isCompleted = index < currentIndex;

        return (
          <div key={status} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? 'bg-green-600 text-white'
                    : isCurrent
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>
              {index < statusOrder.length - 1 && (
                <div
                  className={`w-0.5 h-12 ${
                    isCompleted ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
            <div className="flex-1 pb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h4
                    className={`font-semibold ${
                      isActive ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    {statusLabels[status as keyof typeof statusLabels]}
                  </h4>
                  {event && (
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDate(new Date(event.timestamp))}
                    </p>
                  )}
                  {event?.note && (
                    <p className="text-sm text-gray-700 mt-2">{event.note}</p>
                  )}
                </div>
                {isCurrent && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    Current
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
