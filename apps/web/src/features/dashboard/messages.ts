import { AppLocale } from '@/lib/locale';

import type { DashboardMessages } from './interfaces';

const EN_MESSAGES: DashboardMessages = {
  title: 'Dashboard',
  brandName: 'Flowdesk',
  brandTagline: 'Field dispatch',
  workspace: 'Workspace',
  navDashboard: 'Dashboard',
  welcomeBack: 'Welcome back',
  signedInAs: 'Signed in as {email}.',
  greetingWithName:
    'Hi, {name}. Your workspace is ready — use the sidebar to move around Flowdesk.',
  greeting:
    'Your workspace is ready — use the sidebar to move around Flowdesk.',
  signOut: 'Sign out',
  signedInFallback: 'Signed in',
  openUserMenu: 'Open user menu',
};

const AR_MESSAGES: DashboardMessages = {
  title: 'لوحة التحكم',
  brandName: 'Flowdesk',
  brandTagline: 'تنسيق ميداني',
  workspace: 'مساحة العمل',
  navDashboard: 'لوحة التحكم',
  welcomeBack: 'مرحبًا بعودتك',
  signedInAs: 'مسجّل الدخول باسم {email}.',
  greetingWithName:
    'أهلًا {name} — مساحة عملك جاهزة. استخدم الشريط الجانبي للتنقّل في Flowdesk.',
  greeting: 'مساحة عملك جاهزة — استخدم الشريط الجانبي للتنقّل في Flowdesk.',
  signOut: 'تسجيل الخروج',
  signedInFallback: 'مسجّل الدخول',
  openUserMenu: 'فتح قائمة المستخدم',
};

export const DASHBOARD_MESSAGES: Record<AppLocale, DashboardMessages> = {
  [AppLocale.En]: EN_MESSAGES,
  [AppLocale.Ar]: AR_MESSAGES,
};

export function formatDashboardMessage(
  template: string,
  values: Record<string, string>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '');
}
