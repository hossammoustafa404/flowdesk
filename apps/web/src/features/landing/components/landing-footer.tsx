'use client';

import Link from 'next/link';
import { Workflow } from 'lucide-react';

import { PRODUCT_NAME } from '../constants';
import { LANDING_MESSAGES } from '../messages';
import { useMessages } from '@/hooks/use-messages';

export function LandingFooter() {
  const { messages, localizeHref } = useMessages(LANDING_MESSAGES);

  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
        <div className="max-w-sm">
          <Link
            href={localizeHref('/')}
            className="inline-flex items-center gap-2.5 font-heading text-sm font-semibold tracking-tight"
          >
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Workflow className="size-3.5" aria-hidden="true" />
            </span>
            {PRODUCT_NAME}
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {messages.productTagline}
          </p>
        </div>

        <nav aria-label={messages.actions.footerNav}>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {messages.footerLinks.map((link) => (
              <li key={link.href + link.label}>
                <Link
                  href={localizeHref(link.href)}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
