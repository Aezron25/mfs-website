import { initializeApp, getApps, getApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";

const firebaseConfig = {
  projectId: "studio-9176892725-60858",
  appId: "1:834916416668:web:be6e430428816eb9b14159",
  storageBucket: "studio-9176892725-60858.firebasestorage.app",
  apiKey: "AIzaSyB5wUyztcCqqRsx52JRxrgLzanSJFhpKsM",
  authDomain: "studio-9176892725-60858.firebaseapp.com",
  messagingSenderId: "834916416668",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const functions = getFunctions(app);

export const sendContactEmail = httpsCallable(functions, 'sendContactEmail');

export { app };
