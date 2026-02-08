/**
 * Public Firestore operations for check-in flow
 *
 * Provides unauthenticated read access to user profiles and glass collections.
 * Used by /c/[userId] public check-in route.
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/firestore';

/**
 * Type definition for a glass in a user's collection (public view)
 */
export type GlassInCollection = {
  id: string;
  glassType: string; // References GlassType.id from catalog
  size: string; // Selected size (e.g., "16oz")
  addedAt: Date; // When added to collection
};

/**
 * Get all glasses in a user's collection (public read)
 * @param userId - The user's Firebase Auth UID
 * @returns Array of glasses ordered by addedAt (newest first)
 */
export async function getUserGlassesPublic(
  userId: string
): Promise<GlassInCollection[]> {
  const glassesRef = collection(db, 'users', userId, 'glasses');
  const q = query(glassesRef, orderBy('addedAt', 'desc'));

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      glassType: data.glassType,
      size: data.size,
      addedAt: data.addedAt.toDate(), // Convert Firestore Timestamp to Date
    };
  });
}

/**
 * Get user profile (public read)
 * @param userId - The user's Firebase Auth UID
 * @returns User profile with email, or null if user doesn't exist
 */
export async function getUserProfile(
  userId: string
): Promise<{ email: string } | null> {
  const userDocRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    return null;
  }

  const data = userDoc.data();
  return {
    email: data.email || '',
  };
}
