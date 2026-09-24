import type { NavItem } from './interfaces';

export const DASHBOARD_ROUTES = {
  dashboard: '/dashboard',
  jobs: '/jobs',
  customers: '/customers',
  team: '/team',
} as const;

export const PRIMARY_NAV_ITEMS: readonly NavItem[] = [
  { navKey: 'dashboard', href: DASHBOARD_ROUTES.dashboard },
] as const;
