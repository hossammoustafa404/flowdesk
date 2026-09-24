'use client';

import { useMemo } from 'react';

import { AppLocale } from '@/lib/locale';
import { useLocale } from '@/providers';

export function useMessages<T>(messagesByLocale: Record<AppLocale, T>) {
  const { locale, isRtl, localizeHref } = useLocale();

  return useMemo(
    () => ({
      locale,
      isRtl,
      localizeHref,
      messages: messagesByLocale[locale],
    }),
    [isRtl, locale, localizeHref, messagesByLocale],
  );
}
