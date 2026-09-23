'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import type { MockJobRow } from '../constants';
import { useLandingLocale } from '../hooks';

export function StatusPill({
  status,
}: {
  status: MockJobRow['status'] | 'Cancelled' | 'pending' | 'sent' | 'failed';
}) {
  const { messages } = useLandingLocale();

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium tracking-wide',
        status === 'New' && 'bg-secondary text-secondary-foreground',
        status === 'Assigned' && 'bg-primary/10 text-primary',
        status === 'En route' && 'bg-primary/15 text-primary',
        status === 'On site' && 'bg-success/15 text-success',
        status === 'Blocked' && 'bg-warning/25 text-warning-foreground',
        status === 'Completed' && 'bg-success/15 text-success',
        status === 'Cancelled' && 'bg-muted text-muted-foreground',
        status === 'pending' && 'bg-warning/25 text-warning-foreground',
        status === 'sent' && 'bg-success/15 text-success',
        status === 'failed' && 'bg-destructive/15 text-destructive',
      )}
    >
      {messages.mocks.status[status]}
    </span>
  );
}

export function UrgencyPill({
  urgency,
}: {
  urgency: MockJobRow['urgency'];
}) {
  const { messages } = useLandingLocale();

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium',
        urgency === 'Emergency' && 'bg-urgency text-urgency-foreground',
        urgency === 'Same day' && 'bg-warning/30 text-warning-foreground',
        urgency === 'Scheduled' && 'bg-secondary text-secondary-foreground',
      )}
    >
      {messages.mocks.urgency[urgency]}
    </span>
  );
}

export function MockChrome({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  const { messages } = useLandingLocale();

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-[0_20px_50px_-28px_rgba(30,64,175,0.45)]',
        className,
      )}
      role="img"
      aria-label={subtitle ? `${title}. ${subtitle}` : title}
    >
      <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-3 py-2.5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium">{title}</p>
          {subtitle ? (
            <p className="truncate text-[11px] text-muted-foreground">
              {subtitle}
            </p>
          ) : null}
        </div>
        <span className="hidden rounded-md border border-border bg-background px-2 py-0.5 text-[10px] font-medium tracking-wide text-muted-foreground sm:inline">
          {messages.mocks.orgBadge}
        </span>
      </div>
      {children}
    </div>
  );
}
