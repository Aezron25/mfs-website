
'use client';

import { useState, useEffect } from 'react';

/**
 * A hook that returns `true` once the component has been mounted on the client.
 * This is useful for avoiding hydration mismatches when rendering content that
 * should only be visible on the client (e.g., based on window size).
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
