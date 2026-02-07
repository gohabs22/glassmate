import { GlassCatalogSkeleton } from '@/components/ui/LoadingSkeleton';

/**
 * Loading State for Glass Pages
 * Server Component - Next.js uses automatically during page transitions
 */
export default function GlassesLoading() {
  return (
    <div className="py-8">
      {/* Page header skeleton */}
      <div className="mb-6">
        <div className="mb-2 h-8 w-64 animate-pulse rounded bg-gray-200"></div>
        <div className="h-6 w-32 animate-pulse rounded bg-gray-200"></div>
      </div>

      {/* Navigation links skeleton */}
      <div className="mb-6 flex gap-4">
        <div className="h-6 w-32 animate-pulse rounded bg-gray-200"></div>
        <div className="h-6 w-24 animate-pulse rounded bg-gray-200"></div>
      </div>

      {/* Glass cards skeleton */}
      <GlassCatalogSkeleton />
    </div>
  );
}
