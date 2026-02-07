'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { getUserGlasses, addGlassToCollection } from '@/lib/firebase/glasses-db';
import { GLASS_CATALOG } from '@/lib/data/glass-catalog';
import GlassGuideCard from '@/components/glasses/GlassGuideCard';

/**
 * Glass Guide Page (Dashboard)
 * Detailed glass type reference guide with add-to-collection capability
 * Protected by middleware (requires __session cookie)
 */
export default function GlassGuidePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  // Handle adding a glass to collection
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

  // Show loading spinner while auth is loading
  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Glass Type Guide
        </h1>
        <p className="text-gray-600">
          Learn about different beer glass types and their ideal pairings
        </p>
      </div>

      {/* Navigation links */}
      <div className="mb-6 flex flex-wrap gap-4">
        <Link
          href="/glasses"
          className="font-medium text-amber-600 hover:text-amber-700"
        >
          My Collection
        </Link>
        <Link
          href="/glasses/catalog"
          className="font-medium text-amber-600 hover:text-amber-700"
        >
          Browse Catalog
        </Link>
      </div>

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
            showAddButton={true}
            onAdd={handleAdd}
          />
        ))}
      </div>
    </div>
  );
}
