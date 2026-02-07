'use client';

import { useState } from 'react';
import { GlassType } from '@/lib/data/glass-catalog';

type GlassGuideCardProps = {
  glass: GlassType;
  showAddButton?: boolean;
  onAdd?: (glassType: string, size: string) => Promise<void>;
};

/**
 * GlassGuideCard - Expandable detail card for glass type reference guide
 * Shows full information including beer pairings and optional add functionality
 */
export default function GlassGuideCard({
  glass,
  showAddButton = false,
  onAdd,
}: GlassGuideCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSize, setSelectedSize] = useState(glass.availableSizes[0]);
  const [isPending, setIsPending] = useState(false);

  const handleAdd = async () => {
    if (!onAdd) return;
    setIsPending(true);
    try {
      await onAdd(glass.id, selectedSize);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      {/* Always visible header */}
      <div className="flex items-start gap-4">
        {/* Larger glass illustration */}
        <div className="flex-shrink-0">
          <img
            src={glass.svgPath}
            alt={glass.name}
            className="h-32 w-32"
          />
        </div>

        {/* Glass info */}
        <div className="flex-1">
          <h3 className="mb-2 text-xl font-semibold text-gray-900">
            {glass.name}
          </h3>
          <p className="text-sm text-gray-600">{glass.description}</p>

          {/* Expand/collapse button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 text-sm font-medium text-amber-600 hover:text-amber-700"
          >
            {isExpanded ? 'Show less' : 'Show details'}
          </button>
        </div>
      </div>

      {/* Expandable details */}
      {isExpanded && (
        <div className="mt-4 space-y-4 border-t border-gray-200 pt-4">
          {/* Available sizes */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-gray-900">
              Available Sizes
            </h4>
            <div className="flex flex-wrap gap-2">
              {glass.availableSizes.map((size) => (
                <span
                  key={size}
                  className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>

          {/* Beer style pairings */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-gray-900">
              Beer Style Pairings
            </h4>
            <ul className="space-y-1">
              {glass.beerStyles.map((style) => (
                <li
                  key={style}
                  className="flex items-start text-sm text-gray-600"
                >
                  <span className="mr-2 text-amber-600">•</span>
                  {style}
                </li>
              ))}
            </ul>
          </div>

          {/* Add to collection (optional) */}
          {showAddButton && onAdd && (
            <div className="flex gap-3">
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                disabled={isPending}
                className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                {glass.availableSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAdd}
                disabled={isPending}
                className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-amber-400"
              >
                {isPending ? 'Adding...' : 'Add to Collection'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
