'use client';

import { Button } from '@/components/ui/button';

import { LandingLocale } from '../enums';
import { useLandingLocale } from '../hooks';

export function LocaleToggle() {
  const { locale, messages, setLocale } = useLandingLocale();
  const isArabic = locale === LandingLocale.Ar;

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="min-w-11 cursor-pointer px-2.5 font-medium"
      onClick={() =>
        setLocale(isArabic ? LandingLocale.En : LandingLocale.Ar)
      }
      aria-label={
        isArabic
          ? messages.actions.switchToEnglish
          : messages.actions.switchToArabic
      }
    >
      {isArabic
        ? messages.actions.switchToEnglish
        : messages.actions.switchToArabic}
    </Button>
  );
}
