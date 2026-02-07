'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { addGlassToCollection } from '@/lib/firebase/glasses-db';
import { GLASS_CATALOG } from '@/lib/data/glass-catalog';
import GlassGuideCard from '@/components/glasses/GlassGuideCard';

/**
 * Public Glass Guide Page
 * Educational resource accessible without authentication
 * Shows add-to-collection buttons for logged-in users
 * Outside (dashboard) route group - no middleware protection
 */
export default function PublicGlassGuidePage() {
  const { user, loading: authLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // Handle adding a glass to collection (only if authenticated)
  const handleAdd = useCallback(
    async (glassType: string, size: string) => {
      if (!user) return;

      try {
        setError(null);
        await addGlassToCollection(user.uid, glassType, size);
      } catch (err) {
        console.error('Error adding glass:', err);
        setError('Failed to add glass to collection. Please try again.');
      }
    },
    [user]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-3xl font-bold text-gray-900">
            Beer Glass Guide
          </h1>
          <p className="text-lg text-gray-600">
            Discover the right glass for every beer style
          </p>
        </div>

        {/* CTA for unauthenticated visitors */}
        {!authLoading && !user && (
          <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
            <p className="mb-4 text-gray-900">
              Want to build your own glass collection?
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center rounded-md bg-amber-600 px-6 py-3 text-base font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              Sign Up to Get Started
            </Link>
          </div>
        )}

        {/* Link to dashboard collection for authenticated users */}
        {!authLoading && user && (
          <div className="mb-8 text-center">
            <Link
              href="/glasses"
              className="font-medium text-amber-600 hover:text-amber-700"
            >
              View My Collection →
            </Link>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Glass guide cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {GLASS_CATALOG.map((glass) => (
            <GlassGuideCard
              key={glass.id}
              glass={glass}
              showAddButton={!!user && !authLoading}
              onAdd={user ? handleAdd : undefined}
            />
          ))}
        </div>

        {/* Footer CTA for unauthenticated visitors */}
        {!authLoading && !user && (
          <div className="mt-12 text-center">
            <p className="mb-4 text-gray-600">
              Ready to start your glass collection?
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center rounded-md bg-amber-600 px-6 py-3 text-base font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              Sign Up Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
