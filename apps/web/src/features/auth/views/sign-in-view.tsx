import { Suspense } from 'react';

import { LocalizedLink } from '@/components/localized-link';

import { AuthCard, RedirectIfAuthenticated, SignInForm } from '../components';
import { AUTH_ROUTES } from '../constants';

export function SignInView() {
  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to your Flowdesk workspace."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <LocalizedLink
            href={AUTH_ROUTES.signUp}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Create one
          </LocalizedLink>
        </>
      }
    >
      <RedirectIfAuthenticated />
      <Suspense fallback={null}>
        <SignInForm />
      </Suspense>
    </AuthCard>
  );
}
