
'use client';
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  type Auth,
  connectAuthEmulator,
  inMemoryPersistence,
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

export function initializeFirebase() {
  const firebaseConfig = getFirebaseConfig();

  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      firestore = getFirestore(app);

      // This is a temporary workaround to prevent a known issue with Next.js
      auth.setPersistence(inMemoryPersistence);

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
  } else {
    app = getApp();
    auth = getAuth(app);
    firestore = getFirestore(app);
  }

  return { app, auth, firestore };
}

export * from './provider';
export { useUser, useCollection, useDoc };

    