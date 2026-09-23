'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { LandingLocale } from '../enums';
import type { LandingMessages } from '../interfaces';
import { LANDING_LOCALE_STORAGE_KEY, LANDING_MESSAGES } from '../messages';

interface LandingLocaleContextValue {
  locale: LandingLocale;
  messages: LandingMessages;
  isRtl: boolean;
  setLocale: (locale: LandingLocale) => void;
  toggleLocale: () => void;
}

const LandingLocaleContext = createContext<LandingLocaleContextValue | null>(
  null,
);

function readStoredLocale(): LandingLocale {
  if (typeof window === 'undefined') {
    return LandingLocale.En;
  }

  const stored = window.localStorage.getItem(LANDING_LOCALE_STORAGE_KEY);
  return stored === LandingLocale.Ar ? LandingLocale.Ar : LandingLocale.En;
}

export function LandingLocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LandingLocale>(LandingLocale.En);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setLocaleState(readStoredLocale());
    setIsHydrated(true);
  }, []);

  const setLocale = useCallback((next: LandingLocale) => {
    setLocaleState(next);
    window.localStorage.setItem(LANDING_LOCALE_STORAGE_KEY, next);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(
      locale === LandingLocale.En ? LandingLocale.Ar : LandingLocale.En,
    );
  }, [locale, setLocale]);

  const isRtl = locale === LandingLocale.Ar;
  const messages = LANDING_MESSAGES[locale];

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    document.documentElement.lang = locale;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }, [isHydrated, isRtl, locale]);

  const value = useMemo(
    () => ({
      locale,
      messages,
      isRtl,
      setLocale,
      toggleLocale,
    }),
    [isRtl, locale, messages, setLocale, toggleLocale],
  );

  return (
    <LandingLocaleContext.Provider value={value}>
      <div lang={locale} dir={isRtl ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LandingLocaleContext.Provider>
  );
}

export function useLandingLocale() {
  const context = useContext(LandingLocaleContext);
  if (!context) {
    throw new Error(
      'useLandingLocale must be used within LandingLocaleProvider',
    );
  }
  return context;
}
