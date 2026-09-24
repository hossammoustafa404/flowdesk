'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMessages } from '@/hooks/use-messages';

import { LANDING_AUTH_HREFS, PRODUCT_NAME } from '../constants';
import { LANDING_MESSAGES } from '../messages';
import { Reveal } from './reveal';

export function LandingCta() {
  const { messages, isRtl, localizeHref } = useMessages(LANDING_MESSAGES);

  return (
    <section className="border-t border-border py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
              {PRODUCT_NAME}
            </p>
            <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight text-balance sm:text-3xl md:text-4xl">
              {messages.cta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground text-pretty sm:text-base">
              {messages.cta.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
              <Link
                href={localizeHref(LANDING_AUTH_HREFS.signUp)}
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'h-11 w-full cursor-pointer px-5 sm:w-auto',
                )}
              >
                {messages.actions.createYourOrganization}
                <ArrowRight
                  className={cn('size-4', isRtl && 'rotate-180')}
                  aria-hidden="true"
                />
              </Link>
              <Link
                href={localizeHref(LANDING_AUTH_HREFS.signIn)}
                className={cn(
                  buttonVariants({ size: 'lg', variant: 'outline' }),
                  'h-11 w-full cursor-pointer px-5 sm:w-auto',
                )}
              >
                {messages.actions.signIn}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
