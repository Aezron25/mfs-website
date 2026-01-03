
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  onSnapshot,
  Query,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

interface CollectionState<T> {
  data: T[];
  loading: boolean;
  error: FirestoreError | null;
}

type WithId<T> = T & { id: string };

export function useCollection<T extends DocumentData>(
  q: Query<T> | null
) {
  const [state, setState] = useState<CollectionState<WithId<T>>>({
    data: [],
    loading: true,
    error: null,
  });

  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // No query means no listener
    if (!q) {
      setState({ data: [], loading: false, error: null });
      return;
    }

    setState({ data: [], loading: true, error: null });

    try {
      unsubscribeRef.current = onSnapshot(
        q,
        (snapshot: QuerySnapshot<T>) => {
          const data: WithId<T>[] = snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as WithId<T>)
          );
          setState({ data, loading: false, error: null });
        },
        (error: FirestoreError) => {
          console.error('Error fetching collection:', error);
           if (error.code === 'permission-denied') {
             const permissionError = new FirestorePermissionError({
                path: (q as any)._query.path.segments.join('/'),
                operation: 'list',
             });
             errorEmitter.emit('permission-error', permissionError);
           }
          setState({ data: [], loading: false, error });
        }
      );
    } catch (err: any) {
       setState({ data: [], loading: false, error: err });
    }

    // Cleanup function
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [q]); // Dependency array with the query

  return state;
}
