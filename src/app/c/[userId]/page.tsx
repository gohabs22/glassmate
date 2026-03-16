'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase/auth';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getUserGlassesPublic, getUserProfile } from '@/lib/firebase/public-glasses-db';
import { getGlassType, GlassType } from '@/lib/data/glass-catalog';
import GlassCard from '@/components/glasses/GlassCard';
import BeerSearch from '@/components/beer/BeerSearch';
import StyleBrowser from '@/components/beer/StyleBrowser';
import BeerInfoSheet from '@/components/beer/BeerInfoSheet';
import ResultsSheet from '@/components/beer/ResultsSheet';
import ManualEntryForm from '@/components/beer/ManualEntryForm';
import { matchBeerToGlasses, type MatchResult } from '@/lib/beer/matching';
import type { Beer } from '@/lib/beer/types';

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
  const [selectedBeer, setSelectedBeer] = useState<Beer | null>(null);
  const [showBeerLookup, setShowBeerLookup] = useState(false);
  const [showInfoSheet, setShowInfoSheet] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'browse'>('search');
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [showResultsSheet, setShowResultsSheet] = useState(false);
  const [historySaved, setHistorySaved] = useState(false);

  function handleBeerSelect(beer: Beer) {
    setSelectedBeer(beer);
    setShowBeerLookup(false);
    setShowManualEntry(false);
    setShowInfoSheet(true);
  }

  function handleChangeBeer() {
    setSelectedBeer(null);
    setShowInfoSheet(false);
    setShowResultsSheet(false);
    setShowBeerLookup(true);
  }

  function handleMatchToGlasses(beer: Beer) {
    const result = matchBeerToGlasses(beer, glasses);
    setMatchResult(result);
    setShowInfoSheet(false);
    setShowResultsSheet(true);
    setHistorySaved(false);
  }

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

        {/* Beer lookup section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          {!showBeerLookup && !showManualEntry && !selectedBeer && (
            <div className="text-center">
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                Pick a Beer to Find Your Glass!
              </h2>
              <p className="mb-4 text-gray-600">
                Search for what you&apos;re drinking and we&apos;ll match it to a glass.
              </p>
              <button
                onClick={() => setShowBeerLookup(true)}
                className="rounded-md bg-amber-600 px-6 py-3 text-base font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              >
                Choose a Beer
              </button>
            </div>
          )}

          {showBeerLookup && !selectedBeer && (
            <div>
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Find Your Beer
              </h2>

              {/* Tab switcher */}
              <div className="mb-4 flex gap-1 rounded-lg bg-gray-100 p-1">
                <button
                  onClick={() => setActiveTab('search')}
                  className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'search'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Search
                </button>
                <button
                  onClick={() => setActiveTab('browse')}
                  className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'browse'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Browse by Style
                </button>
              </div>

              {/* Tab content */}
              {activeTab === 'search' ? (
                <div>
                  <BeerSearch onSelect={handleBeerSelect} />
                  <button
                    onClick={() => {
                      setShowManualEntry(true);
                      setShowBeerLookup(false);
                    }}
                    className="mt-3 block w-full text-center text-sm text-amber-600 hover:text-amber-700 hover:underline"
                  >
                    Can&apos;t find your beer? Enter it manually
                  </button>
                </div>
              ) : (
                <StyleBrowser onSelectBeer={handleBeerSelect} />
              )}

              <button
                onClick={() => setShowBeerLookup(false)}
                className="mt-4 block w-full text-center text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          )}

          {showManualEntry && !selectedBeer && (
            <ManualEntryForm
              onSubmit={handleBeerSelect}
              onCancel={() => {
                setShowManualEntry(false);
                setShowBeerLookup(true);
              }}
            />
          )}

          {selectedBeer && (
            <div>
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Your Beer
              </h2>
              <div className="rounded-lg bg-amber-50 p-4">
                <div className="text-lg font-semibold text-gray-900">
                  {selectedBeer.name}
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  {selectedBeer.brewery && selectedBeer.brewery !== 'Unknown' && (
                    <>{selectedBeer.brewery} &middot; </>
                  )}
                  {selectedBeer.style}
                  {selectedBeer.abv != null && <> &middot; {selectedBeer.abv}% ABV</>}
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <button
                  onClick={() => {
                    if (selectedBeer) {
                      handleMatchToGlasses(selectedBeer);
                    }
                  }}
                  className="rounded-md bg-amber-600 px-6 py-3 text-base font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                >
                  Match to Glasses
                </button>
                <button
                  onClick={() => setShowInfoSheet(true)}
                  className="text-sm text-amber-600 hover:text-amber-700 hover:underline"
                >
                  View details
                </button>
                <button
                  onClick={handleChangeBeer}
                  className="text-sm text-amber-600 hover:text-amber-700 hover:underline"
                >
                  Change beer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Beer info bottom sheet */}
      <BeerInfoSheet
        beer={selectedBeer}
        isOpen={showInfoSheet}
        onClose={() => setShowInfoSheet(false)}
        onMatchToGlasses={handleMatchToGlasses}
        onChangeBeer={handleChangeBeer}
      />

      {/* Glass recommendation results sheet */}
      <ResultsSheet
        matchResult={matchResult}
        isOpen={showResultsSheet}
        onClose={() => setShowResultsSheet(false)}
        onSaveToHistory={() => {
          // Will be wired to Firestore in 06-03
          setHistorySaved(true);
        }}
        isLoggedIn={!!currentUser}
        saved={historySaved}
      />
    </div>
  );
}
