import { z } from 'zod';

export const SignUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Name is required')
      .max(100, 'Name must be at most 100 characters')
      .describe('Full name of the aspiring Owner'),
    email: z
      .email('Enter a valid email address')
      .describe('Email address used for Sign-up and verification'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password must be at most 128 characters')
      .describe('Password for the new User'),
    organizationName: z
      .string()
      .trim()
      .min(1, 'Organization name is required')
      .max(100, 'Organization name must be at most 100 characters')
      .describe('Display name for the Organization created at Sign-up'),
  })
  .describe('Owner Sign-up details including Organization name')
  .meta({
    example: {
      name: 'Ahmed Hassan',
      email: 'ahmed.hassan@example.com',
      password: 'customer-password-1',
      organizationName: 'Cairo Care Cleaning',
    },
  });

export type SignUpInput = z.infer<typeof SignUpSchema>;
