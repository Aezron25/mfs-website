'use client';

import { useState, useEffect } from 'react';
import { doc } from 'firebase/firestore';
import { useDoc, useFirestore } from '@/firebase';
import { User } from 'firebase/auth';

interface UseAdminResult {
  isAdmin: boolean;
  isAdminLoading: boolean;
}

export function useAdmin(user: User | null): UseAdminResult {
  const firestore = useFirestore();
  const [adminRef, setAdminRef] = useState<any>(null);

  useEffect(() => {
    if (user) {
      setAdminRef(doc(firestore, 'roles_admin', user.uid));
    } else {
      setAdminRef(null);
    }
  }, [user, firestore]);

  const { data: adminDoc, isLoading: isDocLoading } = useDoc(adminRef, {
    // Only fetch if adminRef is not null
    skip: !adminRef, 
  });
  
  // If we are not checking for an admin (no user), loading is false.
  const isAdminLoading = user ? isDocLoading : false;
  
  // The user is an admin if the document exists.
  const isAdmin = !!adminDoc;

  return { isAdmin, isAdminLoading };
}
