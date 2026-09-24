'use client';

import { Button } from '@/components/ui/button';
import { AppLocale, LOCALE_LABELS } from '@/lib/locale';
import { useLocale } from '@/providers';

export function LocaleToggle() {
  const { locale, setLocale } = useLocale();
  const isArabic = locale === AppLocale.Ar;

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="min-w-11 cursor-pointer px-2.5 font-medium"
      onClick={() =>
        setLocale(isArabic ? AppLocale.En : AppLocale.Ar)
      }
      aria-label={
        isArabic
          ? LOCALE_LABELS.switchToEnglish
          : LOCALE_LABELS.switchToArabic
      }
    >
      {isArabic
        ? LOCALE_LABELS.switchToEnglish
        : LOCALE_LABELS.switchToArabic}
    </Button>
  );
}
