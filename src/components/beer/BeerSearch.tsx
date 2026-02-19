'use client';

import { useState, useEffect } from 'react';
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from '@headlessui/react';
import { useDebounce } from 'use-debounce';
import { searchBeers } from '@/lib/beer/catalog';
import type { Beer } from '@/lib/beer/types';

type BeerSearchProps = {
  onSelect: (beer: Beer) => void;
};

export default function BeerSearch({ onSelect }: BeerSearchProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 300);
  const [results, setResults] = useState<Beer[]>([]);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      return;
    }
    setResults(searchBeers(debouncedQuery));
  }, [debouncedQuery]);

  return (
    <Combobox onChange={(beer: Beer | null) => beer && onSelect(beer)}>
      <div className="relative">
        <ComboboxInput
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          placeholder="Search for a beer, brewery, or style..."
          onChange={(e) => setQuery(e.target.value)}
          displayValue={() => query}
        />

        {debouncedQuery.length >= 2 && (
          <ComboboxOptions
            static
            className="absolute z-10 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
          >
            {results.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">
                No beers found. Try browsing by style below.
              </div>
            ) : (
              results.map((beer) => (
                <ComboboxOption
                  key={beer.id}
                  value={beer}
                  className="cursor-pointer px-4 py-2 data-[focus]:bg-amber-50"
                >
                  <div className="text-sm font-medium text-gray-900">
                    {beer.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {beer.brewery} &middot; {beer.style}
                  </div>
                </ComboboxOption>
              ))
            )}
          </ComboboxOptions>
        )}
      </div>
    </Combobox>
  );
}
