import { z } from 'zod';

export const CreateOrganizationSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Organization name is required')
      .max(100, 'Organization name must be at most 100 characters')
      .describe('Display name for the Organization'),
  })
  .describe('Create an Organization by name')
  .meta({
    example: {
      name: 'Cairo Care Cleaning',
    },
  });

export type CreateOrganizationInput = z.infer<typeof CreateOrganizationSchema>;
