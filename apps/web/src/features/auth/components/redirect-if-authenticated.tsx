'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useSession } from '@/lib/auth-client';
import { useLocale } from '@/providers';

import { AUTH_ROUTES } from '../constants';

export function RedirectIfAuthenticated() {
  const router = useRouter();
  const { localizeHref } = useLocale();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && session) {
      router.replace(localizeHref(AUTH_ROUTES.dashboard));
    }
  }, [isPending, localizeHref, router, session]);

  return null;
}
