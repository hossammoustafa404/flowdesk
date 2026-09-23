'use client';

import { ArrowRight, MapPin } from 'lucide-react';

import { useLandingLocale } from '../hooks';
import { cn } from '@/lib/utils';
import { MockChrome, StatusPill } from './mock-chrome';

const TECH_JOBS = [
  {
    id: 'NF-1842',
    customer: 'Mona Hassan',
    address: 'St. 9, Bldg 14 · Maadi',
    status: 'En route' as const,
    next: 'On site' as const,
  },
  {
    id: 'NF-1838',
    customer: 'Hany Kamel',
    address: 'El Merghany · Heliopolis',
    status: 'Blocked' as const,
    next: null,
    reason: 'Needs part — compressor relay',
  },
  {
    id: 'NF-1831',
    customer: 'Dina Fawzy',
    address: 'Road 263 · Maadi',
    status: 'Assigned' as const,
    next: 'En route' as const,
  },
];

export function TechJobsMock() {
  const { messages, isRtl } = useLandingLocale();
  const { mocks } = messages;

  return (
    <MockChrome title={mocks.techTitle} subtitle={mocks.techSubtitle}>
      <div className="space-y-3 p-3 sm:p-4">
        {TECH_JOBS.map((job) => (
          <article
            key={job.id}
            className="rounded-lg border border-border bg-background p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">
                  {job.id} · {job.customer}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  {job.address}
                </p>
              </div>
              <StatusPill status={job.status} />
            </div>
            {'reason' in job && job.reason ? (
              <p className="mt-2 rounded-md bg-warning/15 px-2 py-1.5 text-xs text-warning-foreground">
                {mocks.reasonPrefix} {job.reason}
              </p>
            ) : null}
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground">
              {job.status === 'Blocked'
                ? mocks.waitingOnOffice
                : `${mocks.markStatus} ${job.next ? mocks.status[job.next] : ''}`}
              {job.status !== 'Blocked' ? (
                <ArrowRight
                  className={cn('size-3.5', isRtl && 'rotate-180')}
                  aria-hidden="true"
                />
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </MockChrome>
  );
}
