'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [firebaseStatus, setFirebaseStatus] = useState<{
    connected: boolean;
    appName?: string;
    error?: string;
  } | null>(null);

  useEffect(() => {
    // Check Firebase initialization on client side
    const checkFirebase = async () => {
      try {
        const { firebaseApp } = await import('@/lib/firebase/clientApp');

        // Check if Firebase has a valid configuration
        if (firebaseApp && firebaseApp.options && firebaseApp.options.projectId) {
          setFirebaseStatus({
            connected: true,
            appName: firebaseApp.name,
          });
        } else {
          setFirebaseStatus({
            connected: false,
            error: 'Firebase not configured',
          });
        }
      } catch (error) {
        setFirebaseStatus({
          connected: false,
          error: error instanceof Error ? error.message : 'Firebase initialization failed',
        });
      }
    };

    checkFirebase();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Beer Glass App</h1>
      <p className="text-lg">Find the right glass for your beer.</p>

      {firebaseStatus && (
        <div className="mt-4 flex items-center gap-2 rounded border border-gray-300 px-4 py-2 text-sm">
          <div
            className={`h-2 w-2 rounded-full ${
              firebaseStatus.connected ? 'bg-green-500' : 'bg-yellow-500'
            }`}
          />
          <span>
            {firebaseStatus.connected
              ? `Firebase connected (${firebaseStatus.appName})`
              : firebaseStatus.error || 'Firebase not configured'}
          </span>
        </div>
      )}
    </div>
  );
}
