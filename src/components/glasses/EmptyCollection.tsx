'use client';

import Link from 'next/link';

/**
 * EmptyCollection - Empty state shown when user has no glasses in collection
 * Provides CTA to browse catalog
 */
export default function EmptyCollection() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {/* Glass icon placeholder */}
      <div className="mb-4">
        <svg
          className="mx-auto h-16 w-16 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      </div>

      {/* Heading */}
      <h2 className="mb-2 text-xl font-semibold text-gray-900">
        You haven't added any glasses yet
      </h2>

      {/* Subtext */}
      <p className="mb-6 max-w-md text-gray-600">
        Start building your collection by browsing our catalog of beer glass types.
      </p>

      {/* CTA Button */}
      <Link
        href="/glasses/catalog"
        className="inline-flex items-center rounded-md bg-amber-600 px-6 py-3 text-base font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
      >
        Browse Catalog
      </Link>
    </div>
  );
}
