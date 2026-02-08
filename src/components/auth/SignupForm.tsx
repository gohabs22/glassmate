'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, AuthError } from 'firebase/auth';
import { auth } from '@/lib/firebase/auth';
import { db } from '@/lib/firebase/firestore';
import { doc, setDoc } from 'firebase/firestore';
import { SignupFormSchema } from '@/lib/validations/auth';

export function SignupForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<{ email?: string[]; password?: string[]; _form?: string[] }>({});
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const validatedFields = SignupFormSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    if (!validatedFields.success) {
      setErrors(validatedFields.error.flatten().fieldErrors);
      setIsPending(false);
      return;
    }

    const { email, password } = validatedFields.data;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: email,
        createdAt: new Date(),
      });

      // onAuthStateChanged fires automatically — set cookie and redirect
      document.cookie = '__session=1; path=/; max-age=2592000';
      router.push('/dashboard');
    } catch (error) {
      const authError = error as AuthError;
      switch (authError.code) {
        case 'auth/email-already-in-use':
          setErrors({ email: ['This email is already registered'] });
          break;
        case 'auth/invalid-email':
          setErrors({ email: ['Invalid email address'] });
          break;
        case 'auth/weak-password':
          setErrors({ password: ['Password is too weak'] });
          break;
        default:
          setErrors({ _form: ['Failed to create account. Please try again.'] });
      }
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password[0]}</p>
        )}
      </div>

      {errors._form && (
        <p className="text-sm text-red-600">{errors._form[0]}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded bg-amber-600 px-4 py-2 text-white hover:bg-amber-700 disabled:opacity-50"
      >
        {isPending ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
}
