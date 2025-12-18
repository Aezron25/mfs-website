
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import type { FirestorePermissionError } from '@/firebase/errors';

/**
 * A client-side component that listens for Firestore permission errors
 * and throws them to be caught by Next.js's development error overlay.
 * This should only be active in development.
 */
export function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      // In a production environment, you might want to log this to a service
      // like Sentry, but in development, we'll throw it to get the Next.js overlay.
      if (process.env.NODE_ENV === 'development') {
        // We throw the error in a timeout to break out of the current React render cycle
        // and ensure it's caught by the global error handlers.
        setTimeout(() => {
          throw error;
        }, 0);
      }
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  return null; // This component does not render anything
}
