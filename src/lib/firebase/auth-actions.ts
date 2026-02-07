'use server';

import { auth } from '@/lib/firebase/auth';
import {
  SignupFormSchema,
  LoginFormSchema,
  SignupFormState,
  LoginFormState,
} from '@/lib/validations/auth';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  AuthError,
} from 'firebase/auth';
import { redirect } from 'next/navigation';

/**
 * Signup server action
 * Validates form data with Zod, creates user with Firebase Auth
 * Returns structured errors for form display
 */
export async function signup(
  state: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  // Extract and validate form data
  const validatedFields = SignupFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // Return validation errors
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    // Create user with Firebase
    await createUserWithEmailAndPassword(auth, email, password);

    // Success - return empty errors
    return { errors: {} };
  } catch (error) {
    // Map Firebase auth errors to form errors
    const authError = error as AuthError;

    switch (authError.code) {
      case 'auth/email-already-in-use':
        return {
          errors: {
            email: ['This email is already registered'],
          },
        };
      case 'auth/invalid-email':
        return {
          errors: {
            email: ['Invalid email address'],
          },
        };
      case 'auth/weak-password':
        return {
          errors: {
            password: ['Password is too weak'],
          },
        };
      default:
        return {
          errors: {
            _form: ['Failed to create account. Please try again.'],
          },
        };
    }
  }
}

/**
 * Login server action
 * Validates form data with Zod, signs in user with Firebase Auth
 * Returns structured errors for form display
 */
export async function login(
  state: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  // Extract and validate form data
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // Return validation errors
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    // Sign in with Firebase
    await signInWithEmailAndPassword(auth, email, password);

    // Success - return empty errors
    return { errors: {} };
  } catch (error) {
    // Map Firebase auth errors to form errors
    const authError = error as AuthError;

    switch (authError.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        // Don't distinguish between these for security
        return {
          errors: {
            _form: ['Invalid email or password'],
          },
        };
      case 'auth/too-many-requests':
        return {
          errors: {
            _form: ['Too many attempts. Try again later.'],
          },
        };
      default:
        return {
          errors: {
            _form: ['Failed to sign in. Please try again.'],
          },
        };
    }
  }
}

/**
 * Logout server action
 * Signs out user and redirects to login page
 */
export async function logout() {
  await signOut(auth);
  redirect('/login');
}
