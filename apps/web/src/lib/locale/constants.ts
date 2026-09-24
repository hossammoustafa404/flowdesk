export enum AppLocale {
  En = 'en',
  Ar = 'ar',
}

export const APP_LOCALES = [AppLocale.En, AppLocale.Ar] as const;

/** Default language uses clean URLs (`/dashboard`). Other locales use `?lang=`. */
export const DEFAULT_LOCALE = AppLocale.En;

export const LANG_QUERY_PARAM = 'lang';

export const LOCALE_LABELS = {
  switchToEnglish: 'English',
  switchToArabic: 'العربية',
} as const;
