'use client';

import { Sheet } from 'react-modal-sheet';
import Link from 'next/link';
import type { MatchResult } from '@/lib/beer/matching';

type ResultsSheetProps = {
  matchResult: MatchResult | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveToHistory: () => void;
  isLoggedIn: boolean;
  saved: boolean;
};

export default function ResultsSheet({
  matchResult,
  isOpen,
  onClose,
  onSaveToHistory,
  isLoggedIn,
  saved,
}: ResultsSheetProps) {
  if (!matchResult) return null;

  const { beer, recommendedGlasses, otherGlasses, idealGlass } = matchResult;

  return (
    <Sheet isOpen={isOpen} onClose={onClose} detent="content">
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="px-6 pb-8">
            {/* Compact beer recap */}
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {beer.name}
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                  {beer.style}
                </span>
                <span className="text-sm text-gray-600">
                  {beer.abv != null ? `${beer.abv}% ABV` : 'ABV unknown'}
                </span>
              </div>
              {beer.brewery && beer.brewery !== 'Unknown' && (
                <p className="mt-1 text-sm text-gray-500">{beer.brewery}</p>
              )}
            </div>

            <div className="border-t border-gray-100" />

            {/* Empty collection case */}
            {idealGlass && (
              <div className="mt-4">
                <div className="rounded-lg bg-amber-50 p-4">
                  <p className="font-medium text-gray-900">
                    {idealGlass.name}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {idealGlass.description}
                  </p>
                  <p className="mt-3 text-sm font-medium text-amber-700">
                    You&apos;ll want a {idealGlass.name} for this {beer.style}. Let your host know!
                  </p>
                </div>
              </div>
            )}

            {/* Recommended glasses section */}
            {recommendedGlasses.length > 0 && (
              <div className="mt-4">
                <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-500">
                  Recommended
                </h3>
                <div className="space-y-3">
                  {recommendedGlasses.map((matched) => (
                    <div key={matched.glass.id} className="flex items-start gap-3">
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-400">
                          #{matched.rank}
                        </span>
                        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="font-medium text-gray-900">
                            {matched.glass.name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {matched.size}
                          </span>
                        </div>
                        <p className="mt-0.5 text-sm leading-snug text-gray-600">
                          {matched.rationale}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other glasses section */}
            {otherGlasses.length > 0 && (
              <div className="mt-4">
                {recommendedGlasses.length > 0 && (
                  <div className="mb-4 border-t border-gray-100" />
                )}
                <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-500">
                  Other options
                </h3>
                {recommendedGlasses.length === 0 && (
                  <p className="mb-3 text-sm text-amber-700">
                    Not an ideal match, but your best bet:
                  </p>
                )}
                <div className="space-y-3">
                  {otherGlasses.map((matched) => (
                    <div key={matched.glass.id} className="flex items-start gap-3">
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-400">
                          #{matched.rank}
                        </span>
                        <span className="h-2.5 w-2.5 rounded-full bg-gray-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="font-medium text-gray-900">
                            {matched.glass.name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {matched.size}
                          </span>
                        </div>
                        <p className="mt-0.5 text-sm leading-snug text-gray-500">
                          {matched.rationale}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Save to history section */}
            {!idealGlass && (
              <div className="mt-6 border-t border-gray-100 pt-4">
                {isLoggedIn && !saved && (
                  <button
                    onClick={onSaveToHistory}
                    className="w-full rounded-md bg-amber-600 px-6 py-3 text-base font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                  >
                    Save to history
                  </button>
                )}
                {isLoggedIn && saved && (
                  <p className="text-center text-green-600">
                    <span className="mr-1">&#10003;</span>
                    Saved!
                  </p>
                )}
                {!isLoggedIn && (
                  <p className="text-center text-sm text-gray-500">
                    <Link
                      href="/signup"
                      className="font-medium text-amber-600 hover:text-amber-700"
                    >
                      Sign up
                    </Link>
                    {' '}to save your beer history
                  </p>
                )}
              </div>
            )}
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={onClose} />
    </Sheet>
  );
}
