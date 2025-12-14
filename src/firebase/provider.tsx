
'use client';

import {
  createContext,
  useContext,
  type ReactNode,
  useMemo,
  useEffect,
  useState,
} from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type {
  DocumentReference,
  Query,
  CollectionReference,
} from 'firebase/firestore';

// Define the context shape
interface FirebaseContextValue {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

// Create the context
const FirebaseContext = createContext<FirebaseContextValue>({
  app: null,
  auth: null,
  firestore: null,
});

// Create the provider component
export function FirebaseProvider({
  children,
  app,
  auth,
  firestore,
}: {
  children: ReactNode;
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}) {
  return (
    <FirebaseContext.Provider value={{ app, auth, firestore }}>
      {children}
    </FirebaseContext.Provider>
  );
}

// Create hook for accessing Firebase services
export function useFirebase() {
  return useContext(FirebaseContext);
}

// Create hook for accessing Firebase App
export function useFirebaseApp() {
  const { app } = useFirebase();
  if (!app) {
    throw new Error('useFirebaseApp must be used within a FirebaseProvider');
  }
  return app;
}

// Create hook for accessing Firebase Auth
export function useAuth() {
  const { auth } = useFirebase();
  if (!auth) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }
  return auth;
}

// Create hook for accessing Firestore
export function useFirestore() {
  const { firestore } = useFirebase();
  if (!firestore) {
    throw new Error('useFirestore must be used within a FirebaseProvider');
  }
  return firestore;
}

/**
 * A hook to memoize a Firestore query or document reference. This is useful for
 * preventing infinite loops in `useEffect` hooks when using `useCollection` or `useDoc`.
 *
 * @param factory A function that returns a Firestore query or document reference.
 * @param deps The dependencies to watch for changes.
 * @returns A memoized Firestore query or document reference.
 */
export function useMemoFirebase<
  T extends DocumentReference | CollectionReference | Query,
>(factory: () => T | null, deps: React.DependencyList): T | null {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const [ref, setRef] = useState<T | null>(() => factory());

  useEffect(() => {
    setRef(factory());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
