'use client';

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/auth';
import { login } from '@/lib/firebase/auth-actions';

export function LoginForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(login, { errors: {} });

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Set session cookie for middleware
        document.cookie = '__session=1; path=/; max-age=2592000'; // 30 days
        router.push('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <form action={formAction} className="space-y-4">
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
        {state.errors?.email && (
          <p className="mt-1 text-sm text-red-600">{state.errors.email[0]}</p>
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
        {state.errors?.password && (
          <p className="mt-1 text-sm text-red-600">{state.errors.password[0]}</p>
        )}
      </div>

      {state.errors?._form && (
        <p className="text-sm text-red-600">{state.errors._form[0]}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded bg-amber-600 px-4 py-2 text-white hover:bg-amber-700 disabled:opacity-50"
      >
        {isPending ? 'Signing in...' : 'Log In'}
      </button>
    </form>
  );
}
