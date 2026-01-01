
'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (!q) {
      setState({ data: [], loading: false, error: null });
      return;
    }

    setState((prevState) => ({ ...prevState, loading: true, error: null }));

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<T>) => {
        const data: WithId<T>[] = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as WithId<T>)
        );
        setState({ data, loading: false, error: null });
      },
      (error: FirestoreError) => {
        console.error('Error fetching collection:', error);
        
        const permissionError = new FirestorePermissionError({
            path: (q as any)._query.path.segments.join('/'),
            operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);

        setState({ data: [], loading: false, error });
      }
    );

    return () => unsubscribe();
  }, [q]);

  return state;
}
