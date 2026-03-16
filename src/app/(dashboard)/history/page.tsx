'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { getUserHistory, type HistoryEntry } from '@/lib/firebase/history-db';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    async function loadHistory() {
      if (!user) return;
      const history = await getUserHistory(user.uid);
      setEntries(history);
      setLoading(false);
    }

    if (user) {
      loadHistory();
    }
  }, [user]);

  if (authLoading || loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  // Count beers per host
  const hostCounts: Record<string, number> = {};
  for (const entry of entries) {
    hostCounts[entry.hostUserId] = (hostCounts[entry.hostUserId] || 0) + 1;
  }

  return (
    <div className="py-8">
      <div className="mb-4">
        <Link
          href="/dashboard"
          className="text-amber-600 hover:text-amber-700 hover:underline"
        >
          &larr; Back to Dashboard
        </Link>
      </div>

      <h1 className="mb-6 text-3xl font-bold text-gray-900">Beer History</h1>

      {entries.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-8 text-center">
          <p className="text-lg text-gray-600">
            No beer history yet. Check in at a friend&apos;s place to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-gray-900">
                    {entry.beer.name}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                      {entry.beer.style}
                    </span>
                    {entry.beer.abv != null && (
                      <span className="text-xs text-gray-500">
                        {entry.beer.abv}% ABV
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 text-sm text-gray-600">
                    Served in: {entry.recommendedGlass.glassName}
                  </div>
                  <div className="mt-0.5 text-sm text-gray-500">
                    at {entry.hostName}&apos;s place
                    <span className="ml-1 text-xs text-gray-400">
                      &middot; {hostCounts[entry.hostUserId]} beer{hostCounts[entry.hostUserId] !== 1 ? 's' : ''} there
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(entry.timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
