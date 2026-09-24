import {
  LANG_QUERY_PARAM,
  parseLocaleParam,
  withLang,
} from '@/lib/locale';

import {
  AUTH_ERROR_MESSAGES,
  AUTH_ROUTES,
  CHECK_EMAIL_CALLBACK_QUERY_PARAM,
  CHECK_EMAIL_QUERY_PARAM,
} from './constants';

interface AuthClientError {
  code?: string;
  message?: string;
  status?: number;
}

export function isEmailNotVerifiedError(
  error: AuthClientError | null | undefined,
): boolean {
  if (!error) {
    return false;
  }

  return error.code === 'EMAIL_NOT_VERIFIED' || error.status === 403;
}

function currentLocaleFromWindow() {
  if (typeof window === 'undefined') {
    return parseLocaleParam(undefined);
  }

  return parseLocaleParam(
    new URLSearchParams(window.location.search).get(LANG_QUERY_PARAM),
  );
}

export function getDashboardCallbackUrl(): string {
  const path = withLang(AUTH_ROUTES.dashboard, currentLocaleFromWindow());

  if (typeof window === 'undefined') {
    return path;
  }

  return `${window.location.origin}${path}`;
}

export function resolveCallbackUrl(callbackUrl?: string): string {
  if (!callbackUrl) {
    return getDashboardCallbackUrl();
  }

  if (callbackUrl.startsWith('http://') || callbackUrl.startsWith('https://')) {
    return callbackUrl;
  }

  const localized = withLang(
    callbackUrl.startsWith('/') ? callbackUrl : `/${callbackUrl}`,
    currentLocaleFromWindow(),
  );

  if (typeof window === 'undefined') {
    return localized;
  }

  return `${window.location.origin}${localized}`;
}

export function buildCheckEmailUrl(email: string, callbackUrl?: string): string {
  const locale = currentLocaleFromWindow();
  const base = withLang(AUTH_ROUTES.checkEmail, locale);
  const url = new URL(base, 'http://local.invalid');

  url.searchParams.set(CHECK_EMAIL_QUERY_PARAM, email);

  const localizedDashboard = withLang(AUTH_ROUTES.dashboard, locale);
  if (
    callbackUrl &&
    callbackUrl !== AUTH_ROUTES.dashboard &&
    callbackUrl !== localizedDashboard
  ) {
    url.searchParams.set(CHECK_EMAIL_CALLBACK_QUERY_PARAM, callbackUrl);
  }

  const search = url.searchParams.toString();
  return `${url.pathname}${search ? `?${search}` : ''}`;
}

export function getAuthErrorMessage(
  error: AuthClientError | null | undefined,
): string {
  if (!error) {
    return AUTH_ERROR_MESSAGES.DEFAULT;
  }

  if (error.code && error.code in AUTH_ERROR_MESSAGES) {
    return AUTH_ERROR_MESSAGES[error.code as keyof typeof AUTH_ERROR_MESSAGES];
  }

  if (error.status === 403) {
    return AUTH_ERROR_MESSAGES.EMAIL_NOT_VERIFIED;
  }

  if (error.message) {
    return error.message;
  }

  return AUTH_ERROR_MESSAGES.DEFAULT;
}
