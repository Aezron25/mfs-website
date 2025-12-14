
'use client';
import { useState, useEffect } from 'react';
import {
  onSnapshot,
  Query,
  DocumentData,
  FirestoreError,
} from 'firebase/firestore';

interface CollectionState<T> {
  data: T[];
  loading: boolean;
  error: FirestoreError | null;
}

export function useCollection<T extends DocumentData>(query: Query<T> | null) {
  const [state, setState] = useState<CollectionState<T>>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!query) {
      setState({ data: [], loading: false, error: null });
      return;
    }

    setState((prevState) => ({ ...prevState, loading: true }));

    const unsubscribe = onSnapshot(
      query,
      (snapshot) => {
        const data = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as T)
        );
        setState({ data, loading: false, error: null });
      },
      (error) => {
        console.error('Error fetching collection:', error);
        setState({ data: [], loading: false, error });
      }
    );

    return () => unsubscribe();
  }, [query]);

  return state;
}

    