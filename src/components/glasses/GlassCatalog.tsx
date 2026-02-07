'use client';

import { GLASS_CATALOG } from '@/lib/data/glass-catalog';
import { GlassInCollection } from '@/lib/firebase/glasses-db';
import GlassCard from './GlassCard';

type GlassCatalogProps = {
  userGlasses: GlassInCollection[];
  onAdd: (glassType: string, size: string) => Promise<void>;
};

/**
 * GlassCatalog - Displays responsive grid of all glass types from catalog
 * Shows add/remove state based on user's current collection
 */
export default function GlassCatalog({ userGlasses, onAdd }: GlassCatalogProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {GLASS_CATALOG.map((glass) => {
        // Check if this glass type is already in user's collection
        const existingEntry = userGlasses.find(
          (ug) => ug.glassType === glass.id
        );
        const isInCollection = !!existingEntry;

        return (
          <GlassCard
            key={glass.id}
            glass={glass}
            isInCollection={isInCollection}
            collectionEntryId={existingEntry?.id}
            selectedSize={existingEntry?.size}
            onAdd={onAdd}
          />
        );
      })}
    </div>
  );
}
