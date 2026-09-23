import React from 'react';
import { render, screen } from '@testing-library/react';

import { ThemeProvider } from '../src/providers';
import Page from '../src/app/page';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });

  class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin = '';
    readonly thresholds: ReadonlyArray<number> = [];
    observe() {
      return undefined;
    }
    unobserve() {
      return undefined;
    }
    disconnect() {
      return undefined;
    }
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });
});

describe('Page', () => {
  it('should render the Flowdesk landing page', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <Page />
      </ThemeProvider>,
    );

    expect(baseElement).toBeTruthy();
    expect(
      screen.getByRole('heading', {
        name: /field dispatch without the whatsapp fog/i,
      }),
    ).toBeTruthy();
  });
});
