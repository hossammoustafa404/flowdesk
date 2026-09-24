'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AUTH_ROUTES } from '@/features/auth';
import { useMessages } from '@/hooks/use-messages';
import { signOut, useSession } from '@/lib/auth-client';

import { DASHBOARD_MESSAGES } from '../messages';

export function UserMenu() {
  const router = useRouter();
  const { isRtl, localizeHref, messages } = useMessages(DASHBOARD_MESSAGES);
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut();
    router.push(localizeHref(AUTH_ROUTES.signIn));
    router.refresh();
  };

  const user = session?.user;
  const displayName =
    user?.name?.trim() || user?.email || messages.signedInFallback;
  const displayEmail = user?.email ?? '';
  const initials = (
    user?.name?.[0] ??
    user?.email?.[0] ??
    '?'
  ).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-9 rounded-full"
            aria-label={messages.openUserMenu}
          />
        }
      >
        <Avatar size="sm">
          {user?.image ? (
            <AvatarImage src={user.image} alt={displayName} />
          ) : null}
          <AvatarFallback className="text-xs font-semibold uppercase">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={isRtl ? 'start' : 'end'}
        className="min-w-56 w-auto"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-0.5">
              <span className="truncate text-sm font-medium text-foreground">
                {displayName}
              </span>
              {displayEmail ? (
                <span className="truncate text-xs text-muted-foreground">
                  {displayEmail}
                </span>
              ) : null}
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => void handleSignOut()}
        >
          <LogOut aria-hidden="true" />
          {messages.signOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
