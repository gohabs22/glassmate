/**
 * Firestore operations for user glass collections
 *
 * Manages CRUD operations on users/{userId}/glasses subcollection.
 * All operations are client-side (not Server Actions) to match project pattern.
 */

import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/firestore';

/**
 * Type definition for a glass in a user's collection
 */
export type GlassInCollection = {
  id: string;
  glassType: string; // References GlassType.id from catalog
  size: string; // Selected size (e.g., "16oz")
  addedAt: Date; // When added to collection
};

/**
 * Get all glasses in a user's collection
 * @param userId - The user's Firebase Auth UID
 * @returns Array of glasses ordered by addedAt (newest first)
 */
export async function getUserGlasses(
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
 * Add a glass to a user's collection
 * @param userId - The user's Firebase Auth UID
 * @param glassType - The glass type ID from catalog (e.g., "pint")
 * @param size - The selected size (e.g., "16oz")
 * @returns The new document ID
 */
export async function addGlassToCollection(
  userId: string,
  glassType: string,
  size: string
): Promise<string> {
  const glassesRef = collection(db, 'users', userId, 'glasses');

  const docRef = await addDoc(glassesRef, {
    glassType,
    size,
    addedAt: Timestamp.now(),
  });

  return docRef.id;
}

/**
 * Remove a glass from a user's collection
 * @param userId - The user's Firebase Auth UID
 * @param glassId - The document ID of the glass to remove
 */
export async function removeGlassFromCollection(
  userId: string,
  glassId: string
): Promise<void> {
  const glassDocRef = doc(db, 'users', userId, 'glasses', glassId);
  await deleteDoc(glassDocRef);
}

/**
 * Update the size of a glass in a user's collection
 * @param userId - The user's Firebase Auth UID
 * @param glassId - The document ID of the glass to update
 * @param size - The new size (e.g., "20oz")
 */
export async function updateGlassInCollection(
  userId: string,
  glassId: string,
  size: string
): Promise<void> {
  const glassDocRef = doc(db, 'users', userId, 'glasses', glassId);
  await updateDoc(glassDocRef, { size });
}
