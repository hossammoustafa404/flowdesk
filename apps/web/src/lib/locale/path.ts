import {
  APP_LOCALES,
  AppLocale,
  DEFAULT_LOCALE,
  LANG_QUERY_PARAM,
} from './constants';

export function isAppLocale(value: string): value is AppLocale {
  return (APP_LOCALES as readonly string[]).includes(value);
}

export function getLocaleDirection(locale: AppLocale): 'ltr' | 'rtl' {
  return locale === AppLocale.Ar ? 'rtl' : 'ltr';
}

export function parseLocaleParam(
  value: string | null | undefined,
): AppLocale {
  if (value && isAppLocale(value)) {
    return value;
  }
  return DEFAULT_LOCALE;
}

/**
 * Build an href that keeps the current path and applies `?lang=` only when
 * the locale is not the default (e.g. `/dashboard` vs `/dashboard?lang=ar`).
 */
export function withLang(href: string, locale: AppLocale): string {
  if (
    !href ||
    href.startsWith('#') ||
    href.startsWith('mailto:') ||
    href.startsWith('http://') ||
    href.startsWith('https://')
  ) {
    return href;
  }

  const url = new URL(href, 'http://local.invalid');

  if (locale === DEFAULT_LOCALE) {
    url.searchParams.delete(LANG_QUERY_PARAM);
  } else {
    url.searchParams.set(LANG_QUERY_PARAM, locale);
  }

  const search = url.searchParams.toString();
  return `${url.pathname}${search ? `?${search}` : ''}${url.hash}`;
}

export function applyDocumentLocale(locale: AppLocale) {
  if (typeof document === 'undefined') {
    return;
  }

  const direction = getLocaleDirection(locale);
  document.documentElement.lang = locale;
  document.documentElement.dir = direction;
  document.documentElement.classList.toggle(
    'font-arabic',
    locale === AppLocale.Ar,
  );
  document.documentElement.classList.toggle(
    'font-sans',
    locale !== AppLocale.Ar,
  );
}
