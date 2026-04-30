/**
 * Firebase client SDK init.
 *
 * Reads config from `NEXT_PUBLIC_FIREBASE_*` env vars (set in `.env.local` —
 * see `.env.local.example` for the shape). Designed to be safe to import on
 * both client and server: returns `null` for `auth` / `db` until the env vars
 * are populated, so the dev preview works without a Firebase project wired up.
 */
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId,
);

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;

function ensure(): FirebaseApp | null {
  if (!firebaseConfigured) return null;
  if (_app) return _app;
  _app = getApps()[0] ?? initializeApp(firebaseConfig);
  return _app;
}

export function getFirebaseAuth(): Auth | null {
  if (typeof window === "undefined") return null;
  const app = ensure();
  if (!app) return null;
  return _auth ?? (_auth = getAuth(app));
}

export function getDb(): Firestore | null {
  const app = ensure();
  if (!app) return null;
  return _db ?? (_db = getFirestore(app));
}
