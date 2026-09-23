import { Injectable, Logger } from '@nestjs/common';
import type { Session } from 'better-auth';
import { APIError } from 'better-auth/api';
import {
  type AuthHookContext,
  AfterHook,
  BeforeCreate,
  DatabaseHook,
  Hook,
} from '@thallesp/nestjs-better-auth';
import { SignUpSchema } from '@flowdesk/schemas';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import {
  AuthPaths,
  ORGANIZATION_SLUG_FALLBACK,
  ORGANIZATION_SLUG_MAX_LENGTH,
} from '../auth.constants';
import { MemberRole } from '../enums';
import type { AuthHookUserContext } from '../interfaces';

@Hook()
@DatabaseHook()
@Injectable()
export class SignUpOrganizationHook {
  private readonly logger = new Logger(SignUpOrganizationHook.name);

  constructor(private readonly prisma: PrismaService) {}

  @AfterHook(AuthPaths.SignUpEmail)
  async afterSignUp(ctx: AuthHookContext): Promise<void> {
    if (ctx.context?.returned instanceof Error) {
      return;
    }

    const parsed = SignUpSchema.parse(ctx.body);
    const user = (ctx.context.returned as AuthHookUserContext).user;
    const userId = BigInt(user.id);

    try {
      const slug = await this.deriveUniqueSlug(parsed.organizationName);
      await this.prisma.organization.create({
        data: {
          name: parsed.organizationName,
          slug,
          members: {
            create: {
              userId,
              role: MemberRole.Owner,
            },
          },
        },
      });
    } catch (error) {
      await this.rollbackUser(userId, error);
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError('INTERNAL_SERVER_ERROR', {
        message: 'Failed to create Organization for Sign-up',
      });
    }
  }

  @BeforeCreate('session')
  async beforeCreateSession(
    session: Session,
  ): Promise<{ data: Session } | undefined> {
    const membership = await this.prisma.member.findFirst({
      where: { userId: BigInt(session.userId) },
      select: { organizationId: true },
      orderBy: { createdAt: 'asc' },
    });

    if (membership === null) {
      return undefined;
    }

    return {
      data: {
        ...session,
        activeOrganizationId: String(membership.organizationId),
      },
    };
  }

  private async rollbackUser(userId: bigint, cause: unknown): Promise<void> {
    this.logger.error(
      'Organization create failed during Sign-up; rolling back User',
      cause instanceof Error ? cause.stack : undefined,
    );

    try {
      await this.prisma.user.delete({ where: { id: userId } });
    } catch (rollbackError) {
      this.logger.error(
        'Failed to roll back User after Organization create failure',
        rollbackError instanceof Error ? rollbackError.stack : undefined,
      );
    }
  }

  private async deriveUniqueSlug(organizationName: string): Promise<string> {
    const base = this.slugify(organizationName);
    let slug = base;
    let suffix = 0;

    while (
      (await this.prisma.organization.findUnique({
        where: { slug },
        select: { id: true },
      })) !== null
    ) {
      suffix += 1;
      const suffixText = `-${suffix}`;
      slug = `${base.slice(0, ORGANIZATION_SLUG_MAX_LENGTH - suffixText.length)}${suffixText}`;
    }

    return slug;
  }

  private slugify(organizationName: string): string {
    const slug = organizationName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, ORGANIZATION_SLUG_MAX_LENGTH);

    return slug === '' ? ORGANIZATION_SLUG_FALLBACK : slug;
  }
}
