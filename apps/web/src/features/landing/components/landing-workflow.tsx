'use client';

import { useLandingLocale } from '../hooks';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';

export function LandingWorkflow() {
  const { messages } = useLandingLocale();

  return (
    <section id="workflow" className="scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow={messages.workflow.eyebrow}
            title={messages.workflow.title}
            description={messages.workflow.description}
          />
        </Reveal>

        <ol className="relative mt-14">
          <div
            className="pointer-events-none absolute top-3 bottom-3 start-[1.15rem] hidden w-px bg-border md:block"
            aria-hidden="true"
          />
          {messages.workflow.steps.map((step, index) => (
            <Reveal key={step.step} delayMs={index * 50}>
              <li className="relative grid gap-4 py-5 md:grid-cols-[3rem_1fr] md:gap-8 md:py-6">
                <div className="flex items-center gap-3 md:block">
                  <span className="relative z-10 flex size-9 items-center justify-center rounded-full border border-border bg-background font-heading text-xs font-semibold text-primary">
                    {step.step}
                  </span>
                  <h3 className="font-heading text-lg font-semibold md:hidden">
                    {step.title}
                  </h3>
                </div>
                <div className="max-w-2xl border-b border-border pb-6 md:border-0 md:pb-0">
                  <h3 className="hidden font-heading text-xl font-semibold tracking-tight md:block">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground text-pretty md:mt-2 md:text-base">
                    {step.description}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
