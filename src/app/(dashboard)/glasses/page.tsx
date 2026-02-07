'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  getUserGlasses,
  removeGlassFromCollection,
  updateGlassInCollection,
  GlassInCollection,
} from '@/lib/firebase/glasses-db';
import GlassCollection from '@/components/glasses/GlassCollection';
import { GlassCatalogSkeleton } from '@/components/ui/LoadingSkeleton';

/**
 * Glass Collection Page
 * Displays user's glass collection with edit/remove capabilities
 * Protected by middleware (requires __session cookie)
 */
export default function GlassCollectionPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [glasses, setGlasses] = useState<GlassInCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  // Fetch user's glasses on mount
  useEffect(() => {
    if (!user) return;

    const fetchGlasses = async () => {
      try {
        setLoading(true);
        setError(null);
        const userGlasses = await getUserGlasses(user.uid);
        setGlasses(userGlasses);
      } catch (err) {
        console.error('Error fetching glasses:', err);
        setError('Failed to load your glass collection. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchGlasses();
  }, [user]);

  // Handle removing a glass from collection
  const handleRemove = useCallback(
    async (glassId: string) => {
      if (!user) return;

      try {
        setError(null);
        await removeGlassFromCollection(user.uid, glassId);
        // Refetch glasses to update UI
        const updatedGlasses = await getUserGlasses(user.uid);
        setGlasses(updatedGlasses);
      } catch (err) {
        console.error('Error removing glass:', err);
        setError('Failed to remove glass. Please try again.');
      }
    },
    [user]
  );

  // Handle updating glass size
  const handleUpdateSize = useCallback(
    async (glassId: string, newSize: string) => {
      if (!user) return;

      try {
        setError(null);
        await updateGlassInCollection(user.uid, glassId, newSize);
        // Refetch glasses to update UI
        const updatedGlasses = await getUserGlasses(user.uid);
        setGlasses(updatedGlasses);
      } catch (err) {
        console.error('Error updating glass size:', err);
        setError('Failed to update glass size. Please try again.');
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
          My Glass Collection
        </h1>
        <p className="text-gray-600">
          {glasses.length === 0
            ? 'No glasses yet'
            : `${glasses.length} ${glasses.length === 1 ? 'glass' : 'glasses'}`}
        </p>
      </div>

      {/* Navigation links */}
      <div className="mb-6 flex flex-wrap gap-4">
        <Link
          href="/glasses/catalog"
          className="font-medium text-amber-600 hover:text-amber-700"
        >
          Browse Catalog
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

      {/* Collection grid or loading skeleton */}
      {loading ? (
        <GlassCatalogSkeleton />
      ) : (
        <GlassCollection
          glasses={glasses}
          onRemove={handleRemove}
          onUpdateSize={handleUpdateSize}
        />
      )}
    </div>
  );
}
