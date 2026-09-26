import { Injectable } from '@nestjs/common';
import { APIError } from 'better-auth/api';
import {
  type AuthHookContext,
  BeforeHook,
  Hook,
} from '@thallesp/nestjs-better-auth';
import { CreateOrganizationSchema } from '@flowdesk/schemas';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import {
  AuthPaths,
  ORGANIZATION_SLUG_FALLBACK,
  ORGANIZATION_SLUG_MAX_LENGTH,
} from '../auth.constants';

@Hook()
@Injectable()
export class CreateOrganizationHook {
  constructor(private readonly prisma: PrismaService) {}

  @BeforeHook(AuthPaths.CreateOrganization)
  async beforeCreateOrganization(ctx: AuthHookContext): Promise<void> {
    const body = this.bodyRecord(ctx);
    const parsed = CreateOrganizationSchema.safeParse({ name: body.name });
    if (!parsed.success) {
      throw new APIError('BAD_REQUEST', {
        message: parsed.error.issues[0]?.message ?? 'Invalid Organization name',
      });
    }

    body.name = parsed.data.name;
    body.slug = await this.deriveUniqueSlug(parsed.data.name);
  }

  private bodyRecord(ctx: AuthHookContext): Record<string, unknown> {
    const body = ctx.body;
    if (body !== null && typeof body === 'object') {
      return body;
    }

    throw new APIError('BAD_REQUEST', {
      message: 'Invalid Organization name',
    });
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
