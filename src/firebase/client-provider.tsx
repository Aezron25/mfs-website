
'use client';

import { initializeFirebase } from '.';
import { FirebaseProvider as FirebaseContextProvider } from './provider';

// This provider is intended to be used in the root layout of your application.
// It will initialize Firebase on the client side and provide the Firebase app, auth, and firestore instances to the rest of your application.
export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const { app, auth, firestore } = initializeFirebase();

  return (
    <FirebaseContextProvider app={app} auth={auth} firestore={firestore}>
      {children}
    </FirebaseContextProvider>
  );
}
