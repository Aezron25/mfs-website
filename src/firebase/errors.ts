
'use client';

import { getAuth } from "firebase/auth";

export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  public readonly context: SecurityRuleContext;

  constructor(context: SecurityRuleContext) {
    const auth = getAuth();
    const user = auth.currentUser;

    const requestDetails = {
      auth: user ? {
        uid: user.uid,
        // @ts-ignore
        token: user.stsTokenManager,
      } : null,
      method: context.operation,
      path: `/databases/(default)/documents/${context.path}`,
      resource: context.requestResourceData,
    };
    
    const message = `FirestoreError: Missing or insufficient permissions: The following request was denied by Firestore Security Rules:\n${JSON.stringify(requestDetails, null, 2)}`;
    
    super(message);
    this.name = 'FirestorePermissionError';
    this.context = context;

    Object.setPrototypeOf(this, FirestorePermissionError.prototype);
  }
}
