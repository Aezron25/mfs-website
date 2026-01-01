'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, onSnapshot, DocumentData } from 'firebase/firestore';
import { useFirebase, useFirestore } from '../provider';
import type { UserProfile } from '@/lib/types';

// Extend the Firebase User type with our custom profile
export type AppUser = User & Partial<UserProfile>;

interface UserContextValue {
  user: AppUser | null;
  isLoading: boolean;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  isLoading: true,
});

export function UserProvider({ children }: { children: ReactNode }) {
  const { auth } = useFirebase();
  const firestore = useFirestore();
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth || !firestore) {
        setIsLoading(false);
        return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is logged in, now listen for profile changes
        const userRef = doc(firestore, 'users', firebaseUser.uid);
        const unsubscribeSnapshot = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            const userProfile = doc.data() as UserProfile;
            setUser({ ...firebaseUser, ...userProfile, id: doc.id });
          } else {
            // User exists in Auth, but not in Firestore.
            // This can happen during signup before the Firestore doc is created.
            setUser(firebaseUser);
          }
           setIsLoading(false);
        }, (error) => {
            console.error("Error fetching user profile:", error);
            setUser(firebaseUser);
            setIsLoading(false);
        });

        return () => unsubscribeSnapshot();
      } else {
        // User is logged out
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [auth, firestore]);

  return (
    <UserContext.Provider value={{ user, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
