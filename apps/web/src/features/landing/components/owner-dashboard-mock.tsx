'use client';

import { cn } from '@/lib/utils';

import { useLandingLocale } from '../hooks';
import { MockChrome, StatusPill } from './mock-chrome';

export function OwnerDashboardMock() {
  const { messages } = useLandingLocale();
  const { mocks } = messages;

  const metrics = [
    {
      key: 'open',
      value: '18',
      tone: 'default' as const,
      ...mocks.metrics.open,
    },
    {
      key: 'overdue',
      value: '4',
      tone: 'danger' as const,
      ...mocks.metrics.overdue,
    },
    {
      key: 'blocked',
      value: '2',
      tone: 'warning' as const,
      ...mocks.metrics.blocked,
    },
    {
      key: 'doneToday',
      value: '11',
      tone: 'success' as const,
      ...mocks.metrics.doneToday,
    },
  ];

  const attention = [
    {
      id: 'NF-1838',
      label: mocks.attention.blockedPart,
      status: 'Blocked' as const,
    },
    {
      id: 'NF-1842',
      label: mocks.attention.asapOpen,
      status: 'En route' as const,
    },
    {
      id: 'NF-1829',
      label: mocks.attention.windowEnded,
      status: 'Assigned' as const,
    },
  ];

  return (
    <MockChrome title={mocks.ownerTitle} subtitle={mocks.ownerSubtitle}>
      <div className="grid grid-cols-2 gap-2 border-b border-border p-3 sm:grid-cols-4 sm:p-4">
        {metrics.map((metric) => (
          <div
            key={metric.key}
            className="rounded-lg border border-border bg-background px-3 py-2.5"
          >
            <p className="text-[11px] tracking-wide text-muted-foreground uppercase">
              {metric.label}
            </p>
            <p
              className={cn(
                'mt-1 font-heading text-2xl font-semibold tracking-tight',
                metric.tone === 'danger' && 'text-destructive',
                metric.tone === 'warning' && 'text-warning-foreground',
                metric.tone === 'success' && 'text-success',
              )}
            >
              {metric.value}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {metric.hint}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-2 p-3 sm:p-4">
        <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
          {mocks.needsAttention}
        </p>
        {attention.map((row) => (
          <div
            key={row.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2 text-xs"
          >
            <div>
              <p className="font-medium">{row.id}</p>
              <p className="text-muted-foreground">{row.label}</p>
            </div>
            <StatusPill status={row.status} />
          </div>
        ))}
      </div>
    </MockChrome>
  );
}
