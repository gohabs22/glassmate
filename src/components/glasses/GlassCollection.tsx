'use client';

import { GlassInCollection } from '@/lib/firebase/glasses-db';
import { getGlassType } from '@/lib/data/glass-catalog';
import GlassCard from './GlassCard';
import EmptyCollection from './EmptyCollection';

type GlassCollectionProps = {
  glasses: GlassInCollection[];
  onRemove: (glassId: string) => Promise<void>;
  onUpdateSize: (glassId: string, newSize: string) => Promise<void>;
};

/**
 * GlassCollection - Displays user's glass collection with edit/remove capabilities
 * Shows empty state if no glasses in collection
 */
export default function GlassCollection({
  glasses,
  onRemove,
  onUpdateSize,
}: GlassCollectionProps) {
  // Show empty state if no glasses
  if (glasses.length === 0) {
    return <EmptyCollection />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {glasses.map((glassInCollection) => {
        // Enrich with catalog data for display
        const glassType = getGlassType(glassInCollection.glassType);

        // Skip if glass type not found in catalog (data integrity issue)
        if (!glassType) {
          console.warn(
            `Glass type "${glassInCollection.glassType}" not found in catalog`
          );
          return null;
        }

        return (
          <GlassCard
            key={glassInCollection.id}
            glass={glassType}
            isInCollection={true}
            collectionEntryId={glassInCollection.id}
            selectedSize={glassInCollection.size}
            onAdd={async () => {}} // Not used when isInCollection=true
            onRemove={onRemove}
            onUpdateSize={onUpdateSize}
          />
        );
      })}
    </div>
  );
}
