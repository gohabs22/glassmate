import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { firebaseConfig } from './config';

// Use getApps() guard to prevent re-initialization during development
let firebaseApp: FirebaseApp;

if (getApps().length === 0) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0];
}

export { firebaseApp };
