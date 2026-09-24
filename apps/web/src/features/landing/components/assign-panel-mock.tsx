'use client';

import { AlertTriangle, Check } from 'lucide-react';

import { useMessages } from '@/hooks/use-messages';

import { MOCK_TECHNICIANS } from '../constants';
import { LANDING_MESSAGES } from '../messages';
import { MockChrome } from './mock-chrome';

export function AssignPanelMock() {
  const { messages } = useMessages(LANDING_MESSAGES);
  const { mocks } = messages;

  return (
    <MockChrome title={mocks.assignTitle} subtitle={mocks.assignSubtitle}>
      <div className="space-y-3 p-3 sm:p-4">
        <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          {mocks.assignIntake}
        </div>

        <ul className="space-y-2">
          {MOCK_TECHNICIANS.map((tech) => (
            <li
              key={tech.name}
              className={`flex items-start justify-between gap-3 rounded-lg border px-3 py-2.5 ${
                tech.active
                  ? 'border-border bg-background'
                  : 'border-dashed border-border/80 bg-muted/30 opacity-70'
              } ${tech.name === 'Nour Saleh' ? 'ring-2 ring-primary/40' : ''}`}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium">{tech.name}</p>
                  {!tech.active ? (
                    <span className="text-[10px] font-medium tracking-wide text-destructive uppercase">
                      {mocks.inactive}
                    </span>
                  ) : null}
                  {tech.name === 'Nour Saleh' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary">
                      <Check className="size-3" aria-hidden="true" />
                      {mocks.selected}
                    </span>
                  ) : null}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {tech.skills} · {tech.area}
                </p>
              </div>
              <div className="shrink-0 text-end text-xs">
                <p className="font-medium">{tech.openJobs}</p>
                <p className="text-muted-foreground">{mocks.openToday}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex items-start gap-2 rounded-lg border border-warning/40 bg-warning/15 px-3 py-2 text-xs text-warning-foreground">
          <AlertTriangle
            className="mt-0.5 size-3.5 shrink-0"
            aria-hidden="true"
          />
          <p>{mocks.assignHint}</p>
        </div>
      </div>
    </MockChrome>
  );
}
