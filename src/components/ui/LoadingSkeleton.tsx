/**
 * LoadingSkeleton - Animated placeholders for glass cards and catalog
 * Server Component (pure presentation, no interactivity)
 */

/**
 * GlassCardSkeleton - Animated placeholder matching GlassCard dimensions
 */
export function GlassCardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      {/* Image placeholder */}
      <div className="mb-3 flex justify-center">
        <div className="h-24 w-24 rounded-lg bg-gray-200"></div>
      </div>

      {/* Title placeholder */}
      <div className="mb-2 h-6 rounded bg-gray-200"></div>

      {/* Description placeholder (2 lines) */}
      <div className="mb-1 h-4 rounded bg-gray-200"></div>
      <div className="mb-4 h-4 w-3/4 rounded bg-gray-200"></div>

      {/* Size selector placeholder */}
      <div className="mb-2 h-10 rounded bg-gray-200"></div>

      {/* Button placeholder */}
      <div className="h-10 rounded bg-gray-200"></div>
    </div>
  );
}

/**
 * GlassCatalogSkeleton - Grid of GlassCardSkeleton matching catalog layout
 */
export function GlassCatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <GlassCardSkeleton key={i} />
      ))}
    </div>
  );
}
