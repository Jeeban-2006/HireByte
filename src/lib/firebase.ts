
import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

// Your web app's Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: "", // Optional, can be added if needed
};

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);
  
  if (missingFields.length > 0) {
    console.warn('Missing Firebase configuration fields:', missingFields);
    return false;
  }

  // Validate API key format
  if (firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('AIza')) {
    console.warn('Firebase API key appears to be invalid format');
    return false;
  }

  return true;
};

// Initialize Firebase only if we have valid configuration and we're in the browser
let app: FirebaseApp | undefined;
let auth: Auth | undefined;

if (typeof window !== 'undefined' && validateFirebaseConfig()) {
  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
      console.log('Firebase app initialized successfully');
    } else {
      app = getApp();
      console.log('Firebase app already initialized');
    }
    auth = getAuth(app);
    console.log('Firebase auth initialized successfully');
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    app = undefined;
    auth = undefined;
  }
} else if (typeof window === 'undefined') {
  // Server-side: create a minimal config to avoid errors
  console.log('Firebase initialization skipped on server-side');
} else {
  console.error('Firebase configuration is invalid or incomplete');
}

export { app, auth };

// Utility function to check if Firebase is ready
export const isFirebaseReady = (): boolean => {
  return !!auth && !!app;
};

// Utility function to get auth with error handling
export const getAuthInstance = (): Auth | null => {
  if (!auth) {
    console.error('Firebase auth is not initialized');
    return null;
  }
  return auth;
};
