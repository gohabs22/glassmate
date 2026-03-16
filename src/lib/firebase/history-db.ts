'use client';

import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/firestore';

export type HistoryEntry = {
  id: string;
  hostUserId: string;
  hostName: string;
  beer: {
    name: string;
    style: string;
    abv: number | null;
    brewery: string;
  };
  recommendedGlass: {
    glassId: string;
    glassName: string;
  };
  timestamp: number;
};

/**
 * Save a beer selection to the user's history subcollection.
 */
export async function saveHistoryEntry(
  userId: string,
  hostUserId: string,
  hostName: string,
  beer: { name: string; style: string; abv: number | null; brewery: string },
  recommendedGlass: { glassId: string; glassName: string }
): Promise<void> {
  const historyRef = collection(db, 'users', userId, 'history');
  await addDoc(historyRef, {
    hostUserId,
    hostName,
    beer: {
      name: beer.name,
      style: beer.style,
      abv: beer.abv,
      brewery: beer.brewery,
    },
    recommendedGlass,
    timestamp: Date.now(),
  });
}

/**
 * Get all history entries for a user, ordered by most recent first.
 */
export async function getUserHistory(userId: string): Promise<HistoryEntry[]> {
  const historyRef = collection(db, 'users', userId, 'history');
  const q = query(historyRef, orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<HistoryEntry, 'id'>),
  }));
}
