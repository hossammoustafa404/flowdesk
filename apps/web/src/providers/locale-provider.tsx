'use client';

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  type ReactNode,
} from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  AppLocale,
  DEFAULT_LOCALE,
  LANG_QUERY_PARAM,
  applyDocumentLocale,
  getLocaleDirection,
  parseLocaleParam,
  withLang,
} from '@/lib/locale';

interface LocaleContextValue {
  locale: AppLocale;
  isRtl: boolean;
  setLocale: (locale: AppLocale) => void;
  toggleLocale: () => void;
  localizeHref: (href: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = parseLocaleParam(searchParams.get(LANG_QUERY_PARAM));

  useLayoutEffect(() => {
    applyDocumentLocale(locale);
  }, [locale]);

  const setLocale = useCallback(
    (next: AppLocale) => {
      if (next === locale) {
        return;
      }

      const params = new URLSearchParams(searchParams.toString());
      if (next === DEFAULT_LOCALE) {
        params.delete(LANG_QUERY_PARAM);
      } else {
        params.set(LANG_QUERY_PARAM, next);
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [locale, pathname, router, searchParams],
  );

  const toggleLocale = useCallback(() => {
    setLocale(locale === AppLocale.En ? AppLocale.Ar : AppLocale.En);
  }, [locale, setLocale]);

  const localizeHref = useCallback(
    (href: string) => withLang(href, locale),
    [locale],
  );

  const value = useMemo(
    () => ({
      locale,
      isRtl: getLocaleDirection(locale) === 'rtl',
      setLocale,
      toggleLocale,
      localizeHref,
    }),
    [locale, localizeHref, setLocale, toggleLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}
