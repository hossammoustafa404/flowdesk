'use client';

import { useLandingLocale } from '../hooks';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';

export function LandingProblem() {
  const { messages } = useLandingLocale();

  return (
    <section className="border-y border-border bg-muted/35 py-20 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow={messages.problem.eyebrow}
            title={messages.problem.title}
            description={messages.problem.description}
          />
        </Reveal>

        <Reveal delayMs={80}>
          <ol className="divide-y divide-border rounded-xl border border-border bg-card">
            {messages.problem.points.map((point, index) => (
              <li
                key={point.title}
                className="grid gap-2 px-5 py-4 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-4"
              >
                <span className="font-heading text-sm font-semibold text-primary">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-heading text-base font-semibold tracking-tight">
                    {point.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground text-pretty">
                    {point.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
