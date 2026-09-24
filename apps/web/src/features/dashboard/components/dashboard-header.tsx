'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { LocaleToggle } from '@/components/locale-toggle';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useMessages } from '@/hooks/use-messages';

import { DASHBOARD_MESSAGES } from '../messages';
import { UserMenu } from './user-menu';

export function DashboardHeader() {
  const { messages } = useMessages(DASHBOARD_MESSAGES);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border px-4">
      <div className="flex min-w-0 items-center gap-2">
        <SidebarTrigger className="-ms-1" />
        <Separator
          orientation="vertical"
          className="me-2 data-vertical:h-4 data-vertical:self-auto"
        />
        <h1 className="truncate font-heading text-sm font-medium">
          {messages.title}
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <LocaleToggle />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
