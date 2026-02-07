import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseApp } from './clientApp';

export const db: Firestore = getFirestore(firebaseApp);
