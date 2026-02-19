'use client';

import { useState } from 'react';
import { Sheet } from 'react-modal-sheet';
import type { Beer } from '@/lib/beer/types';

type BeerInfoSheetProps = {
  beer: Beer | null;
  isOpen: boolean;
  onClose: () => void;
  onMatchToGlasses: (beer: Beer) => void;
  onChangeBeer: () => void;
};

const SOURCE_LABELS: Record<Beer['source'], string> = {
  catalog: 'From catalog',
  'style-browse': 'Selected by style',
  manual: 'Manual entry',
};

export default function BeerInfoSheet({
  beer,
  isOpen,
  onClose,
  onMatchToGlasses,
  onChangeBeer,
}: BeerInfoSheetProps) {
  const [showDetails, setShowDetails] = useState(false);

  if (!beer) return null;

  return (
    <Sheet isOpen={isOpen} onClose={onClose} detent="content">
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="px-6 pb-8">
            {/* Beer image or placeholder */}
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-xl bg-amber-100 text-3xl">
              🍺
            </div>

            {/* Name */}
            <h2 className="text-2xl font-bold text-gray-900">{beer.name}</h2>

            {/* Brewery */}
            {beer.brewery && beer.brewery !== 'Unknown' && (
              <p className="mt-1 text-gray-600">{beer.brewery}</p>
            )}

            {/* Style badge + ABV */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                {beer.style}
              </span>
              <span className="text-sm text-gray-600">
                {beer.abv != null ? `${beer.abv}% ABV` : 'ABV unknown'}
              </span>
            </div>

            {/* Description */}
            <p className="mt-4 text-sm leading-relaxed text-gray-700">
              {beer.description}
            </p>

            {/* Show details toggle */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="mt-3 text-sm font-medium text-amber-600 hover:text-amber-700"
            >
              {showDetails ? 'Hide details' : 'Show details'}
            </button>

            {showDetails && (
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p>
                  IBU: {beer.ibu != null ? beer.ibu : 'N/A'}
                </p>
                <p>Source: {SOURCE_LABELS[beer.source]}</p>
              </div>
            )}

            {/* Match to glasses CTA */}
            <button
              onClick={() => onMatchToGlasses(beer)}
              className="mt-6 w-full rounded-md bg-amber-600 px-6 py-3 text-base font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              Match to Glasses
            </button>

            {/* Change beer link */}
            <button
              onClick={onChangeBeer}
              className="mt-3 block w-full text-center text-sm text-amber-600 hover:text-amber-700 hover:underline"
            >
              Choose a different beer
            </button>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={onClose} />
    </Sheet>
  );
}
