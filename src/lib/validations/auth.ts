import { z } from 'zod';

// Signup validation schema with password strength requirements
export const SignupFormSchema = z.object({
  email: z.string().email('Invalid email address').trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-zA-Z]/, 'Password must contain a letter')
    .regex(/[0-9]/, 'Password must contain a number')
    .trim(),
});

// Login validation schema with minimal validation (Firebase handles credential checking)
export const LoginFormSchema = z.object({
  email: z.string().email('Invalid email address').trim(),
  password: z.string().min(1, 'Password is required').trim(),
});

// Form state types for server actions
export type SignupFormState = {
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
};

export type LoginFormState = {
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
};
