'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  getUserGlasses,
  addGlassToCollection,
  GlassInCollection,
} from '@/lib/firebase/glasses-db';
import GlassCatalog from '@/components/glasses/GlassCatalog';
import { GlassCatalogSkeleton } from '@/components/ui/LoadingSkeleton';

/**
 * Glass Catalog Page
 * Browse all glass types and add to collection
 * Protected by middleware (requires __session cookie)
 */
export default function GlassCatalogPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [userGlasses, setUserGlasses] = useState<GlassInCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  // Fetch user's existing glasses to mark which are already in collection
  useEffect(() => {
    if (!user) return;

    const fetchUserGlasses = async () => {
      try {
        setLoading(true);
        setError(null);
        const glasses = await getUserGlasses(user.uid);
        setUserGlasses(glasses);
      } catch (err) {
        console.error('Error fetching user glasses:', err);
        setError('Failed to load your collection. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserGlasses();
  }, [user]);

  // Handle adding a glass to collection
  const handleAdd = useCallback(
    async (glassType: string, size: string) => {
      if (!user) return;

      try {
        setError(null);
        await addGlassToCollection(user.uid, glassType, size);
        // Refetch user glasses to update "already in collection" state
        const updatedGlasses = await getUserGlasses(user.uid);
        setUserGlasses(updatedGlasses);
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
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Glass Catalog</h1>
        <p className="text-gray-600">
          Browse and add glass types to your collection
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
          href="/glasses/guide"
          className="font-medium text-amber-600 hover:text-amber-700"
        >
          Glass Guide
        </Link>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Catalog grid or loading skeleton */}
      {loading ? (
        <GlassCatalogSkeleton />
      ) : (
        <GlassCatalog userGlasses={userGlasses} onAdd={handleAdd} />
      )}
    </div>
  );
}
