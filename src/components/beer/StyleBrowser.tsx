'use client';

import { useState } from 'react';
import { BEER_STYLE_CATEGORIES, getExampleBeer } from '@/lib/beer/styles';
import type { Beer, BeerStyle } from '@/lib/beer/types';

type StyleBrowserProps = {
  onSelectBeer: (beer: Beer) => void;
};

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`h-4 w-4 text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function StyleBrowser({ onSelectBeer }: StyleBrowserProps) {
  const [expandedStyle, setExpandedStyle] = useState<string | null>(null);

  function handleStyleClick(style: BeerStyle) {
    setExpandedStyle(expandedStyle === style.id ? null : style.id);
  }

  function handleExampleClick(style: BeerStyle) {
    onSelectBeer(getExampleBeer(style));
  }

  return (
    <div className="space-y-6">
      {BEER_STYLE_CATEGORIES.map((category) => (
        <div key={category.name}>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
            {category.name}
          </h3>
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            {category.styles.map((style, idx) => (
              <div key={style.id}>
                {idx > 0 && <div className="border-t border-gray-100" />}
                <button
                  onClick={() => handleStyleClick(style)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {style.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {style.typicalAbv[0]}–{style.typicalAbv[1]}% ABV
                    </div>
                  </div>
                  <ChevronIcon expanded={expandedStyle === style.id} />
                </button>

                {expandedStyle === style.id && (
                  <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
                    <p className="mb-3 text-xs text-gray-600">
                      {style.description}
                    </p>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">
                        Popular examples:
                      </p>
                      {style.exampleBeers.map((name) => (
                        <button
                          key={name}
                          onClick={() => handleExampleClick(style)}
                          className="block w-full rounded px-2 py-1.5 text-left text-sm text-amber-700 hover:bg-amber-50"
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
