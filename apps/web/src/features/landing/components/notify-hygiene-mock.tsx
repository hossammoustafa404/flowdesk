'use client';

import { MOCK_NOTIFY_ROWS } from '../constants';
import { useLandingLocale } from '../hooks';
import { MockChrome, StatusPill } from './mock-chrome';

export function NotifyHygieneMock() {
  const { messages } = useLandingLocale();
  const { mocks } = messages;

  return (
    <MockChrome title={mocks.notifyTitle} subtitle={mocks.notifySubtitle}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[28rem] text-start text-xs">
          <thead className="border-b border-border text-[10px] tracking-wide text-muted-foreground uppercase">
            <tr>
              <th className="px-3 py-2 font-medium sm:px-4">
                {mocks.notifyTable.event}
              </th>
              <th className="px-3 py-2 font-medium">
                {mocks.notifyTable.recipient}
              </th>
              <th className="px-3 py-2 font-medium">
                {mocks.notifyTable.channel}
              </th>
              <th className="px-3 py-2 font-medium sm:px-4">
                {mocks.notifyTable.delivery}
              </th>
            </tr>
          </thead>
          <tbody>
            {MOCK_NOTIFY_ROWS.map((row) => (
              <tr
                key={`${row.event}-${row.recipient}-${row.status}`}
                className="border-b border-border/70 last:border-0"
              >
                <td className="px-3 py-2.5 font-medium sm:px-4">
                  {mocks.events[row.event]}
                </td>
                <td className="px-3 py-2.5">{row.recipient}</td>
                <td className="px-3 py-2.5 text-muted-foreground">
                  {row.channel}
                </td>
                <td className="px-3 py-2.5 sm:px-4">
                  <StatusPill status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-border bg-muted/40 px-3 py-3 sm:px-4">
        <span className="rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground">
          {mocks.resend}
        </span>
        <span className="rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium">
          {mocks.markInformed}
        </span>
        <p className="w-full text-[11px] text-muted-foreground sm:ms-auto sm:w-auto sm:self-center">
          {mocks.notifyFooter}
        </p>
      </div>
    </MockChrome>
  );
}
