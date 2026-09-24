'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useMessages } from '@/hooks/use-messages';

import { DASHBOARD_ROUTES, PRIMARY_NAV_ITEMS } from '../constants';
import { DASHBOARD_MESSAGES } from '../messages';

const NAV_ICONS: Record<string, LucideIcon> = {
  [DASHBOARD_ROUTES.dashboard]: LayoutDashboard,
};

const NAV_LABEL_KEYS = {
  dashboard: 'navDashboard',
} as const;

export function AppSidebar() {
  const pathname = usePathname();
  const { isRtl, localizeHref, messages } = useMessages(DASHBOARD_MESSAGES);

  return (
    <Sidebar collapsible="icon" side={isRtl ? 'right' : 'left'}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={
                <Link href={localizeHref(DASHBOARD_ROUTES.dashboard)} />
              }
              tooltip={messages.brandName}
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Wrench className="size-4" aria-hidden="true" />
              </div>
              <div className="grid flex-1 text-start text-sm leading-tight">
                <span className="truncate font-heading font-semibold">
                  {messages.brandName}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {messages.brandTagline}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{messages.workspace}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {PRIMARY_NAV_ITEMS.map((item) => {
                const Icon = NAV_ICONS[item.href] ?? LayoutDashboard;
                const label = messages[NAV_LABEL_KEYS[item.navKey]];
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={localizeHref(item.href)} />}
                      isActive={isActive}
                      tooltip={label}
                    >
                      <Icon aria-hidden="true" />
                      <span>{label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
