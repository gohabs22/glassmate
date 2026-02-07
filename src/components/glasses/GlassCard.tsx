'use client';

import { useState } from 'react';
import { GlassType } from '@/lib/data/glass-catalog';

type GlassCardProps = {
  glass: GlassType;
  isInCollection: boolean;
  collectionEntryId?: string;
  selectedSize?: string;
  onAdd: (glassType: string, size: string) => Promise<void>;
  onRemove?: (glassId: string) => Promise<void>;
  onUpdateSize?: (glassId: string, newSize: string) => Promise<void>;
};

/**
 * GlassCard - Reusable glass card with add/remove/edit actions
 * Displays glass illustration, name, description, and interactive controls
 */
export default function GlassCard({
  glass,
  isInCollection,
  collectionEntryId,
  selectedSize: initialSelectedSize,
  onAdd,
  onRemove,
  onUpdateSize,
}: GlassCardProps) {
  const [selectedSize, setSelectedSize] = useState(
    initialSelectedSize || glass.availableSizes[0]
  );
  const [isPending, setIsPending] = useState(false);

  const handleAdd = async () => {
    setIsPending(true);
    try {
      await onAdd(glass.id, selectedSize);
    } finally {
      setIsPending(false);
    }
  };

  const handleRemove = async () => {
    if (!collectionEntryId || !onRemove) return;
    setIsPending(true);
    try {
      await onRemove(collectionEntryId);
    } finally {
      setIsPending(false);
    }
  };

  const handleSizeChange = async (newSize: string) => {
    if (!collectionEntryId || !onUpdateSize) return;
    setSelectedSize(newSize);
    setIsPending(true);
    try {
      await onUpdateSize(collectionEntryId, newSize);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      {/* Glass illustration */}
      <div className="mb-3">
        <img
          src={glass.svgPath}
          alt={glass.name}
          className="mx-auto h-24 w-24"
        />
      </div>

      {/* Glass name and description */}
      <div className="mb-4">
        <h3 className="mb-1 truncate text-lg font-semibold text-gray-900" title={glass.name}>
          {glass.name}
        </h3>
        <p className="text-sm text-gray-600">{glass.description}</p>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        {!isInCollection ? (
          <>
            {/* Size selector for adding */}
            <div>
              <label
                htmlFor={`size-${glass.id}`}
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Size
              </label>
              <select
                id={`size-${glass.id}`}
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                disabled={isPending}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                {glass.availableSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Add button */}
            <button
              onClick={handleAdd}
              disabled={isPending}
              className="w-full rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-amber-400"
            >
              {isPending ? 'Adding...' : 'Add to Collection'}
            </button>
          </>
        ) : (
          <>
            {/* Size selector for editing */}
            <div>
              <label
                htmlFor={`size-${glass.id}-edit`}
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Change Size
              </label>
              <select
                id={`size-${glass.id}-edit`}
                value={selectedSize}
                onChange={(e) => handleSizeChange(e.target.value)}
                disabled={isPending}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                {glass.availableSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Remove button */}
            <button
              onClick={handleRemove}
              disabled={isPending}
              className="w-full rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              {isPending ? 'Removing...' : 'Remove from Collection'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
