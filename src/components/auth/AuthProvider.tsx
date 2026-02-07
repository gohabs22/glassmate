'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth } from '@/lib/firebase/auth';
import { User, onAuthStateChanged } from 'firebase/auth';

/**
 * Auth context type definition
 * - user: Firebase User object or null if not authenticated
 * - loading: true until first auth state check completes (prevents FOUC)
 */
type AuthContextType = {
  user: User | null;
  loading: boolean;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

/**
 * AuthProvider component
 * Wraps app with Firebase auth state observer
 * Manages user state and loading state to prevent flash of wrong UI
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false); // Mark as loaded after first callback
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context
 * Use this in components to get current user and loading state
 */
export function useAuth() {
  return useContext(AuthContext);
}
