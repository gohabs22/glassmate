'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { SetupWizard } from '@/components/dashboard/SetupWizard';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  const handleLogout = async () => {
    await signOut(auth);
    // Clear session cookie
    document.cookie = '__session=; path=/; max-age=0';
    router.push('/login');
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-lg text-gray-600">Welcome, {user.email}!</p>
      </div>

      <SetupWizard onDismiss={() => {}} />

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/dashboard/glasses"
          className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Manage My Glasses
          </h2>
          <p className="text-sm text-gray-600">
            Add, edit, and organize your glassware collection
          </p>
        </Link>

        <Link
          href="/scan"
          className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Check In Somewhere
          </h2>
          <p className="text-sm text-gray-600">
            Scan a QR code to see a host's glass collection
          </p>
        </Link>
      </div>

      <div className="mt-8">
        <button
          onClick={handleLogout}
          className="text-gray-500 hover:text-gray-700"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
