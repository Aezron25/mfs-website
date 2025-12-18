
'use client';

import { initializeFirebase } from '.';
import { FirebaseProvider as FirebaseContextProvider } from './provider';
import { UserProvider } from './auth/use-user';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

// This provider is intended to be used in the root layout of your application.
// It will initialize Firebase on the client side and provide the Firebase app, auth, and firestore instances to the rest of your application.
export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const { app, auth, firestore } = initializeFirebase();

  return (
    <FirebaseContextProvider app={app} auth={auth} firestore={firestore}>
      <UserProvider>
        {children}
        {process.env.NODE_ENV === 'development' && <FirebaseErrorListener />}
      </UserProvider>
    </FirebaseContextProvider>
  );
}
