'use client';

import {
  LandingCta,
  LandingFaq,
  LandingFooter,
  LandingHeader,
  LandingHero,
  LandingProblem,
  LandingRoles,
  LandingShowcase,
  LandingWorkflow,
} from '../components';
import { LandingLocaleProvider, useLandingLocale } from '../hooks';

function LandingContent() {
  const { messages } = useLandingLocale();

  return (
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-clip">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:start-3 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        {messages.skipToContent}
      </a>
      <LandingHeader />
      <main id="main-content" className="min-w-0 flex-1">
        <LandingHero />
        <LandingProblem />
        <LandingWorkflow />
        <LandingShowcase />
        <LandingRoles />
        <LandingFaq />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  );
}

export function LandingView() {
  return (
    <LandingLocaleProvider>
      <LandingContent />
    </LandingLocaleProvider>
  );
}
