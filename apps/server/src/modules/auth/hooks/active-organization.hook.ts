import { Injectable } from '@nestjs/common';
import type { Session } from 'better-auth';
import {
  AfterUpdate,
  BeforeCreate,
  DatabaseHook,
  Hook,
} from '@thallesp/nestjs-better-auth';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Hook()
@DatabaseHook()
@Injectable()
export class ActiveOrganizationHook {
  constructor(private readonly prisma: PrismaService) {}

  @AfterUpdate('session')
  async afterUpdateSession(session: object | null): Promise<void> {
    if (session === null) {
      return;
    }

    await this.rememberLastActiveOrganization(session);
  }

  @BeforeCreate('session')
  async beforeCreateSession(session: Session) {
    const userId = this.userIdOf(session);
    if (userId === null) {
      return undefined;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { lastActiveOrganizationId: true },
    });
    if (user?.lastActiveOrganizationId == null) {
      return undefined;
    }

    const membership = await this.prisma.member.findUnique({
      where: {
        organizationId_userId: {
          organizationId: user.lastActiveOrganizationId,
          userId,
        },
      },
      select: { organizationId: true },
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

  private async rememberLastActiveOrganization(session: object): Promise<void> {
    const userId = this.userIdOf(session);
    const organizationId = this.organizationIdOf(session);
    if (userId === null || organizationId === null) {
      return;
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { lastActiveOrganizationId: organizationId },
    });
  }

  private userIdOf(session: object): bigint | null {
    if (!('userId' in session)) {
      return null;
    }

    return this.toBigInt(session.userId);
  }

  private organizationIdOf(session: object): bigint | null {
    if (!('activeOrganizationId' in session)) {
      return null;
    }

    return this.toBigInt(session.activeOrganizationId);
  }

  private toBigInt(value: unknown): bigint | null {
    if (
      typeof value !== 'bigint' &&
      typeof value !== 'number' &&
      typeof value !== 'string'
    ) {
      return null;
    }

    if (value === '') {
      return null;
    }

    return BigInt(value);
  }
}
