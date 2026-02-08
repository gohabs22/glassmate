'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase/auth';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getUserGlassesPublic, getUserProfile } from '@/lib/firebase/public-glasses-db';
import { getGlassType, GlassType } from '@/lib/data/glass-catalog';
import GlassCard from '@/components/glasses/GlassCard';

type ResolvedGlass = {
  glassType: GlassType;
  size: string;
};

/**
 * Public check-in page - drinkers land here after scanning a QR code
 * Shows the host's glass collection in read-only mode
 */
export default function CheckInPage() {
  const params = useParams();
  const userId = params.userId as string;

  const [loading, setLoading] = useState(true);
  const [hostName, setHostName] = useState('');
  const [glasses, setGlasses] = useState<ResolvedGlass[]>([]);
  const [userNotFound, setUserNotFound] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [checkedIn, setCheckedIn] = useState(false);

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function loadHostData() {
      try {
        // Check if user exists
        const profile = await getUserProfile(userId);
        if (!profile) {
          setUserNotFound(true);
          setLoading(false);
          return;
        }

        // Extract display name from email
        const displayName = profile.email.split('@')[0];
        setHostName(displayName);

        // Load glass collection
        const glassCollection = await getUserGlassesPublic(userId);

        // Resolve full glass type details from catalog
        const resolved: ResolvedGlass[] = [];
        for (const glass of glassCollection) {
          const glassType = getGlassType(glass.glassType);
          if (glassType) {
            resolved.push({
              glassType,
              size: glass.size,
            });
          }
        }

        setGlasses(resolved);
        setLoading(false);
      } catch (error) {
        console.error('Error loading host data:', error);
        setUserNotFound(true);
        setLoading(false);
      }
    }

    if (userId) {
      loadHostData();
    }
  }, [userId]);

  // User not found state
  if (userNotFound) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Invalid Check-in Code
          </h1>
          <p className="mb-8 text-gray-600">
            This QR code is invalid or the host no longer exists.
          </p>
          <Link
            href="/signup"
            className="inline-block rounded-md bg-amber-600 px-6 py-3 text-base font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            Create Your Own Collection
          </Link>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  // Dual-role handling: logged-in user visiting ANOTHER host's collection
  const isVisitingAnotherHost = currentUser && currentUser.uid !== userId;
  const isViewingOwnCollection = currentUser && currentUser.uid === userId;

  // Show check-in confirmation for logged-in users at another host's place
  if (isVisitingAnotherHost && !checkedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-md">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Check in at {hostName}&apos;s place?
          </h1>
          <p className="mb-6 text-gray-600">
            You&apos;ll see their glass collection and can find the perfect glass for your beer.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setCheckedIn(true)}
              className="rounded-md bg-amber-600 px-6 py-3 text-base font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              Check In
            </button>
            <Link
              href="/dashboard"
              className="text-center text-amber-600 hover:text-amber-700 hover:underline"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        {/* Back to dashboard link for logged-in users */}
        {currentUser && (
          <div className="mb-4">
            <Link
              href="/dashboard"
              className="text-amber-600 hover:text-amber-700 hover:underline"
            >
              ← Back to Dashboard
            </Link>
          </div>
        )}

        {/* Host greeting */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            {hostName}&apos;s Glass Collection
          </h1>
          <p className="text-gray-600">
            {isViewingOwnCollection
              ? 'This is how guests will see your collection'
              : 'Welcome! Here are the glasses available'}
          </p>
        </div>

        {/* Empty collection state */}
        {glasses.length === 0 ? (
          <div className="mb-12 rounded-lg border-2 border-dashed border-gray-300 bg-white p-8 text-center">
            <p className="mb-4 text-lg text-gray-600">
              {hostName} hasn&apos;t added any glasses yet.
            </p>
            <Link
              href="/guide"
              className="text-amber-600 hover:text-amber-700 hover:underline"
            >
              Browse the Beer Glass Guide
            </Link>
          </div>
        ) : (
          /* Glass collection grid */
          <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {glasses.map((glass) => (
              <GlassCard
                key={glass.glassType.id}
                glass={glass.glassType}
                isInCollection={true}
                readOnly={true}
                displaySize={glass.size}
              />
            ))}
          </div>
        )}

        {/* Coming-soon beer teaser */}
        <div className="rounded-lg bg-gray-100 p-8 text-center">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Pick a Beer to Find Your Glass!
          </h2>
          <p className="mb-4 text-gray-600">Beer matching is coming soon!</p>
          <button
            disabled
            className="cursor-not-allowed rounded-md bg-gray-300 px-6 py-3 text-base font-medium text-gray-500"
          >
            Choose a Beer
          </button>
        </div>
      </div>
    </div>
  );
}
