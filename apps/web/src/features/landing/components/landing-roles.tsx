'use client';

import { LANDING_ROLE_ICONS } from '../constants';
import { useLandingLocale } from '../hooks';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';

export function LandingRoles() {
  const { messages } = useLandingLocale();

  return (
    <section id="roles" className="scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow={messages.roles.eyebrow}
            title={messages.roles.title}
            description={messages.roles.description}
            align="center"
            className="mx-auto"
          />
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {messages.roles.items.map((role, index) => {
            const Icon = LANDING_ROLE_ICONS[role.id];
            return (
              <Reveal key={role.id} delayMs={index * 70}>
                <article className="flex h-full flex-col rounded-xl border border-border bg-card p-6">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 font-heading text-xl font-semibold tracking-tight">
                    {role.role}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
                    {role.summary}
                  </p>
                  <ul className="mt-6 space-y-2.5 border-t border-border pt-5">
                    {role.capabilities.map((capability) => (
                      <li
                        key={capability}
                        className="flex gap-2.5 text-sm leading-relaxed"
                      >
                        <span
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                          aria-hidden="true"
                        />
                        <span>{capability}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
