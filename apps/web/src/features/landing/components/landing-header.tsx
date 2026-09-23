'use client';

import Link from 'next/link';
import { Menu, Workflow, X } from 'lucide-react';
import { useState } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { LANDING_AUTH_HREFS, PRODUCT_NAME } from '../constants';
import { useLandingLocale } from '../hooks';
import { LocaleToggle } from './locale-toggle';
import { ThemeToggle } from './theme-toggle';

export function LandingHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages } = useLandingLocale();

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-heading text-base font-semibold tracking-tight"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Workflow className="size-4" aria-hidden="true" />
          </span>
          <span>{PRODUCT_NAME}</span>
        </Link>

        <nav
          className="hidden items-center gap-7 md:flex"
          aria-label={messages.actions.mainNav}
        >
          {messages.nav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-1.5">
          <LocaleToggle />
          <ThemeToggle />
          <Link
            href={LANDING_AUTH_HREFS.signIn}
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'hidden cursor-pointer sm:inline-flex',
            )}
          >
            {messages.actions.signIn}
          </Link>
          <Link
            href={LANDING_AUTH_HREFS.signUp}
            className={cn(
              buttonVariants({ size: 'sm' }),
              'hidden cursor-pointer sm:inline-flex',
            )}
          >
            {messages.actions.createOrganization}
          </Link>
          <button
            type="button"
            className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border border-transparent text-foreground transition-colors hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:hidden"
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            aria-label={
              isOpen
                ? messages.actions.closeMenu
                : messages.actions.openMenu
            }
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? (
              <X className="size-4" aria-hidden="true" />
            ) : (
              <Menu className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {isOpen ? (
        <div
          id="mobile-nav"
          className="border-t border-border bg-background px-4 py-4 md:hidden"
        >
          <nav
            className="flex flex-col gap-1"
            aria-label={messages.actions.mobileNav}
          >
            {messages.nav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
            <Link
              href={LANDING_AUTH_HREFS.signIn}
              className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
              onClick={() => setIsOpen(false)}
            >
              {messages.actions.signIn}
            </Link>
            <Link
              href={LANDING_AUTH_HREFS.signUp}
              className={cn(buttonVariants(), 'w-full')}
              onClick={() => setIsOpen(false)}
            >
              {messages.actions.createOrganization}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
