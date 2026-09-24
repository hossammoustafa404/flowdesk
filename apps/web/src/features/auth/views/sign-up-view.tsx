import { Suspense } from 'react';

import { LocalizedLink } from '@/components/localized-link';

import { AuthCard, RedirectIfAuthenticated, SignUpForm } from '../components';
import { AUTH_ROUTES } from '../constants';

export function SignUpView() {
  return (
    <AuthCard
      title="Create your organization"
      description="Enter your details and Organization name. We will email a verification link and sign you in once it is confirmed."
      footer={
        <>
          Already have an account?{' '}
          <LocalizedLink
            href={AUTH_ROUTES.signIn}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </LocalizedLink>
        </>
      }
    >
      <RedirectIfAuthenticated />
      <Suspense fallback={null}>
        <SignUpForm />
      </Suspense>
    </AuthCard>
  );
}
