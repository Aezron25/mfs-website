
'use client';
import { useState, useEffect } from 'react';
import {
  onSnapshot,
  doc,
  DocumentReference,
  DocumentData,
  FirestoreError,
} from 'firebase/firestore';

interface DocState<T> {
  data: T | null;
  loading: boolean;
  error: FirestoreError | null;
}

export function useDoc<T extends DocumentData>(
  ref: DocumentReference<T> | null
) {
  const [state, setState] = useState<DocState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!ref) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    setState((prevState) => ({ ...prevState, loading: true }));

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        const data = snapshot.exists()
          ? ({ id: snapshot.id, ...snapshot.data() } as T)
          : null;
        setState({ data, loading: false, error: null });
      },
      (error) => {
        console.error('Error fetching document:', error);
        setState({ data: null, loading: false, error });
      }
    );

    return () => unsubscribe();
  }, [ref]);

  return state;
}

    