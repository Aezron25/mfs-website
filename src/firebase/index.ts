'use client';
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  type Auth,
  connectAuthEmulator,
  browserSessionPersistence,
  setPersistence,
} from 'firebase/auth';
import {
  getFirestore,
  type Firestore,
  connectFirestoreEmulator,
} from 'firebase/firestore';
import {
  getStorage,
  type FirebaseStorage,
  connectStorageEmulator,
} from 'firebase/storage';

import { getFirebaseConfig } from './config';
import { useUser } from './auth/use-user';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let storage: FirebaseStorage;
let firebasePromise: Promise<{ app: FirebaseApp, auth: Auth, firestore: Firestore, storage: FirebaseStorage }> | null = null;

export function initializeFirebase() {
  if (firebasePromise) {
     if(app && auth && firestore && storage) {
        return { app, auth, firestore, storage };
     }
     throw new Error("Firebase initialization is in progress.");
  }

  if (getApps().length) {
    app = getApp();
    auth = getAuth(app);
    firestore = getFirestore(app);
    storage = getStorage(app);
    return { app, auth, firestore, storage };
  }

  const firebaseConfig = getFirebaseConfig();

  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    firestore = getFirestore(app);
    storage = getStorage(app);

    setPersistence(auth, browserSessionPersistence);

    if (process.env.NEXT_PUBLIC_EMULATOR_HOST) {
      const host = process.env.NEXT_PUBLIC_EMULATOR_HOST;
      console.log(`Connecting to Firebase emulators on ${host}`);
      connectAuthEmulator(auth, `http://${host}:9099`, {
        disableWarnings: true,
      });
      connectFirestoreEmulator(firestore, host, 8080);
      connectStorageEmulator(storage, host, 9199);
    } else {
      console.log('Connecting to production Firebase services.');
    }
  } catch (e) {
    console.error('Failed to initialize Firebase', e);
  }

  return { app, auth, firestore, storage };
}

export * from './provider';
export { useUser, useCollection, useDoc };
