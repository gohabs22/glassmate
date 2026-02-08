'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { QRCodeDisplay } from '@/components/qr/QRCodeDisplay';

export default function QRPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-lg px-4">
        {/* Back link to dashboard */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="font-medium text-amber-600 hover:text-amber-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Page header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Your QR Code
          </h1>
          <p className="text-gray-600">
            Share this QR code with your guests so they can see your glass
            collection
          </p>
        </div>

        {/* QR Code Display */}
        <div className="mb-8">
          <QRCodeDisplay userId={user.uid} />
        </div>

        {/* Helper text */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <p className="text-center text-sm text-gray-600">
            Guests scan this code to view your glasses and find their perfect
            beer glass
          </p>
        </div>
      </div>
    </div>
  );
}
