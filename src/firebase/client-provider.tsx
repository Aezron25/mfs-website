
'use client';

import { ReactNode, useMemo } from 'react';
import { initializeFirebase, FirebaseProvider } from '@/firebase';
import { UserProvider } from './auth/use-user';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const { app, auth, firestore } = useMemo(() => initializeFirebase(), []);

  if (!app || !auth || !firestore) {
    // This can happen if initialization fails.
    // You might want to render a fallback UI here.
    return <>{children}</>;
  }

  return (
    <FirebaseProvider app={app} auth={auth} firestore={firestore}>
      <UserProvider>
        {children}
        {process.env.NODE_ENV === 'development' && <FirebaseErrorListener />}
      </UserProvider>
    </FirebaseProvider>
  );
}
