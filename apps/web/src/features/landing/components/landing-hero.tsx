'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { LANDING_AUTH_HREFS, PRODUCT_NAME } from '../constants';
import { useLandingLocale } from '../hooks';
import { JobsBoardMock } from './jobs-board-mock';

export function LandingHero() {
  const { messages, isRtl } = useLandingLocale();

  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_90%_55%_at_50%_-15%,color-mix(in_oklch,var(--primary)_18%,transparent),transparent)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[42rem] bg-[linear-gradient(to_right,color-mix(in_oklch,var(--border)_70%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--border)_70%,transparent)_1px,transparent_1px)] bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_70%_55%_at_50%_0%,#000_55%,transparent_100%)] opacity-50"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl px-4 pt-14 pb-6 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-heading text-base font-semibold tracking-[0.2em] text-primary uppercase sm:text-lg">
            {PRODUCT_NAME}
          </p>
          <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
            {messages.hero.headline}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground text-pretty sm:text-lg">
            {messages.productTagline} {messages.hero.supporting}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={LANDING_AUTH_HREFS.signUp}
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
              href="#workflow"
              className={cn(
                buttonVariants({ size: 'lg', variant: 'outline' }),
                'h-11 w-full cursor-pointer px-5 sm:w-auto',
              )}
            >
              {messages.actions.seeHowItWorks}
            </Link>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-3 pb-12 sm:px-6 sm:pb-16 lg:px-8">
        <div
          className="pointer-events-none absolute -inset-x-10 top-8 -z-10 h-[70%] bg-[radial-gradient(ellipse_at_center,color-mix(in_oklch,var(--primary)_14%,transparent),transparent_68%)]"
          aria-hidden="true"
        />
        <p className="mb-3 text-center text-xs tracking-wide text-muted-foreground sm:text-sm">
          {messages.hero.boardCaption}
        </p>
        <JobsBoardMock />
      </div>
    </section>
  );
}
