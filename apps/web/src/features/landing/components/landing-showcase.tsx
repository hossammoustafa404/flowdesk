'use client';

import { useLandingLocale } from '../hooks';
import { AssignPanelMock } from './assign-panel-mock';
import { NotifyHygieneMock } from './notify-hygiene-mock';
import { OwnerDashboardMock } from './owner-dashboard-mock';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';
import { TechJobsMock } from './tech-jobs-mock';

function ShowcaseMock({
  mock,
}: {
  mock: 'assign' | 'tech' | 'owner' | 'notify';
}) {
  switch (mock) {
    case 'assign':
      return <AssignPanelMock />;
    case 'tech':
      return <TechJobsMock />;
    case 'owner':
      return <OwnerDashboardMock />;
    case 'notify':
      return <NotifyHygieneMock />;
  }
}

export function LandingShowcase() {
  const { messages } = useLandingLocale();

  return (
    <section
      id="product"
      className="scroll-mt-24 border-y border-border bg-muted/25 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow={messages.showcase.eyebrow}
            title={messages.showcase.title}
            description={messages.showcase.description}
          />
        </Reveal>

        <div className="mt-16 space-y-24">
          {messages.showcase.items.map((item, index) => {
            const isReversed = index % 2 === 1;

            return (
              <Reveal key={item.id}>
                <article className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
                  <div
                    className={
                      isReversed ? 'min-w-0 lg:order-2' : 'min-w-0'
                    }
                  >
                    <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                      {item.eyebrow}
                    </p>
                    <h3 className="mt-3 font-heading text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-base text-muted-foreground text-pretty">
                      {item.description}
                    </p>
                    <ul className="mt-6 space-y-3">
                      {item.points.map((point) => (
                        <li
                          key={point}
                          className="flex gap-3 text-sm leading-relaxed text-foreground/90"
                        >
                          <span
                            className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                            aria-hidden="true"
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div
                    className={
                      isReversed ? 'min-w-0 lg:order-1' : 'min-w-0'
                    }
                  >
                    <ShowcaseMock mock={item.mock} />
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
