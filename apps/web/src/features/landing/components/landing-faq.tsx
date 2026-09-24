'use client';

import { useMessages } from '@/hooks/use-messages';

import { LANDING_MESSAGES } from '../messages';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';

export function LandingFaq() {
  const { messages } = useMessages(LANDING_MESSAGES);

  return (
    <section
      id="faq"
      className="scroll-mt-24 border-y border-border bg-muted/30 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow={messages.faq.eyebrow}
              title={messages.faq.title}
              description={messages.faq.description}
            />
          </Reveal>

          <Reveal delayMs={80}>
            <div className="divide-y divide-border rounded-xl border border-border bg-card">
              {messages.faq.items.map((item) => (
                <details
                  key={item.question}
                  className="group px-5 py-1 open:bg-muted/20"
                >
                  <summary className="cursor-pointer list-none py-4 font-heading text-base font-semibold tracking-tight marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
                    <span className="flex items-start justify-between gap-4">
                      <span>{item.question}</span>
                      <span
                        className="mt-0.5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45"
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </span>
                  </summary>
                  <p className="pb-4 text-sm leading-relaxed text-muted-foreground text-pretty">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
