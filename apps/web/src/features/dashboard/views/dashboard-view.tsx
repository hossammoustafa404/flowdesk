'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AUTH_ROUTES } from '@/features/auth';
import { useMessages } from '@/hooks/use-messages';
import { useSession } from '@/lib/auth-client';

import {
  DASHBOARD_MESSAGES,
  formatDashboardMessage,
} from '../messages';

export function DashboardView() {
  const router = useRouter();
  const { localizeHref, messages } = useMessages(DASHBOARD_MESSAGES);
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace(localizeHref(AUTH_ROUTES.signIn));
    }
  }, [isPending, localizeHref, router, session]);

  if (isPending || !session) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Loader2
          className="size-6 animate-spin text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    );
  }

  const user = session.user;
  const greeting = user?.name
    ? formatDashboardMessage(messages.greetingWithName, {
        name: user.name,
      })
    : messages.greeting;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-2xl">
          {messages.welcomeBack}
        </CardTitle>
        <CardDescription>
          {formatDashboardMessage(messages.signedInAs, {
            email: user?.email ?? '',
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{greeting}</p>
      </CardContent>
    </Card>
  );
}
