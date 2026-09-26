import { z } from 'zod';

export const SignUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Name is required')
      .max(100, 'Name must be at most 100 characters')
      .describe('Full name of the User'),
    email: z
      .email('Enter a valid email address')
      .describe('Email address used for Sign-up and verification'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password must be at most 128 characters')
      .describe('Password for the new User'),
    confirmPassword: z
      .string()
      .min(1, 'Confirm your password')
      .describe('Confirmation of the password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })
  .describe('Sign-up details for a User')
  .meta({
    example: {
      name: 'Ahmed Hassan',
      email: 'ahmed.hassan@example.com',
      password: 'customer-password-1',
      confirmPassword: 'customer-password-1',
    },
  });

export type SignUpInput = z.infer<typeof SignUpSchema>;
