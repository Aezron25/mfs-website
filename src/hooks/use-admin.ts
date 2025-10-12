'use client';

import { useState, useEffect } from 'react';
import { doc, DocumentReference, DocumentData } from 'firebase/firestore';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { User } from 'firebase/auth';

interface UseAdminResult {
  isAdmin: boolean;
  isAdminLoading: boolean;
}

export function useAdmin(user: User | null): UseAdminResult {
  const firestore = useFirestore();
  
  const adminRef = useMemoFirebase(() => {
    if (user && firestore) {
      return doc(firestore, 'roles_admin', user.uid);
    }
    return null;
  }, [user, firestore]);

  const { data: adminDoc, isLoading: isDocLoading } = useDoc(adminRef);
  
  // If we are not checking for an admin (no user), loading is false.
  const isAdminLoading = user ? isDocLoading : false;
  
  // The user is an admin if the document exists.
  const isAdmin = !!adminDoc;

  return { isAdmin, isAdminLoading };
}
