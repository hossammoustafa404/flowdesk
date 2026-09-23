'use client';

import { MOCK_BOARD_JOBS } from '../constants';
import { useLandingLocale } from '../hooks';
import { MockChrome, StatusPill, UrgencyPill } from './mock-chrome';

export function JobsBoardMock({ compact = false }: { compact?: boolean }) {
  const { messages } = useLandingLocale();
  const jobs = compact ? MOCK_BOARD_JOBS.slice(0, 4) : MOCK_BOARD_JOBS;
  const { mocks } = messages;

  return (
    <MockChrome title={mocks.boardTitle} subtitle={mocks.boardSubtitle}>
      <div className="border-b border-border bg-background/80 px-3 py-2 sm:px-4">
        <div className="flex flex-wrap gap-2 text-[11px]">
          <span className="rounded-md bg-primary px-2.5 py-1 font-medium text-primary-foreground">
            {mocks.boardFilters.all}
          </span>
          <span className="rounded-md px-2.5 py-1 text-muted-foreground">
            {mocks.boardFilters.new}
          </span>
          <span className="rounded-md px-2.5 py-1 text-muted-foreground">
            {mocks.boardFilters.enRoute}
          </span>
          <span className="rounded-md px-2.5 py-1 text-muted-foreground">
            {mocks.boardFilters.blocked}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] text-start text-xs">
          <thead className="border-b border-border text-[10px] tracking-wide text-muted-foreground uppercase">
            <tr>
              <th className="px-3 py-2 font-medium sm:px-4">{mocks.table.job}</th>
              <th className="px-3 py-2 font-medium">{mocks.table.customer}</th>
              <th className="px-3 py-2 font-medium">{mocks.table.service}</th>
              <th className="px-3 py-2 font-medium">{mocks.table.urgency}</th>
              <th className="px-3 py-2 font-medium">{mocks.table.status}</th>
              <th className="px-3 py-2 font-medium sm:px-4">
                {mocks.table.assignee}
              </th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr
                key={job.id}
                className="border-b border-border/70 last:border-0"
              >
                <td className="px-3 py-2.5 align-top sm:px-4">
                  <div className="font-medium">{job.id}</div>
                  <div className="text-muted-foreground">
                    {job.area} · {job.window}
                  </div>
                </td>
                <td className="px-3 py-2.5 align-top font-medium">
                  {job.customer}
                </td>
                <td className="px-3 py-2.5 align-top text-muted-foreground">
                  {job.service}
                </td>
                <td className="px-3 py-2.5 align-top">
                  <UrgencyPill urgency={job.urgency} />
                </td>
                <td className="px-3 py-2.5 align-top">
                  <StatusPill status={job.status} />
                </td>
                <td className="px-3 py-2.5 align-top text-muted-foreground sm:px-4">
                  {job.assignee ?? mocks.table.unassigned}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MockChrome>
  );
}
