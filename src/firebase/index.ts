
'use client';
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  type Auth,
  connectAuthEmulator,
  browserLocalPersistence,
  setPersistence,
} from 'firebase/auth';
import {
  getFirestore,
  type Firestore,
  connectFirestoreEmulator,
} from 'firebase/firestore';

import { getFirebaseConfig } from './config';
import { useUser } from './auth/use-user';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let firebasePromise: Promise<{ app: FirebaseApp, auth: Auth, firestore: Firestore }> | null = null;

export function initializeFirebase() {
  if (firebasePromise) {
     // If initialization is already in progress, return the existing promise.
     // We don't have the initialized instances yet, so we can't return them.
     // This path is unlikely in a typical client-side scenario but good for safety.
     // The component using this will suspend until the promise resolves.
     // A better pattern might involve a context that provides the resolved values.
     // For now, we'll return the initialized instances if they exist, or throw.
     if(app && auth && firestore) {
        return { app, auth, firestore };
     }
     // This case should ideally not be hit if used within React's lifecycle
     throw new Error("Firebase initialization is in progress.");
  }

  if (getApps().length) {
    app = getApp();
    auth = getAuth(app);
    firestore = getFirestore(app);
    return { app, auth, firestore };
  }

  const firebaseConfig = getFirebaseConfig();

  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    firestore = getFirestore(app);

    // Persist authentication state across sessions.
    setPersistence(auth, browserLocalPersistence);

    if (process.env.NEXT_PUBLIC_EMULATOR_HOST) {
      const host = process.env.NEXT_PUBLIC_EMULATOR_HOST;
      console.log(`Connecting to Firebase emulators on ${host}`);
      connectAuthEmulator(auth, `http://${host}:9099`, {
        disableWarnings: true,
      });
      connectFirestoreEmulator(firestore, host, 8080);
    } else {
      console.log('Connecting to production Firebase services.');
    }
  } catch (e) {
    console.error('Failed to initialize Firebase', e);
  }

  return { app, auth, firestore };
}

export * from './provider';
export { useUser, useCollection, useDoc };

    