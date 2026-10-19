import { getApp, getApps, initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { createAuth } from './auth';

// Expo indsætter disse værdier fra .env.local, når appen bygges.
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
};

// Login kan testes, selvom Realtime Database endnu ikke er oprettet.
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
export const missingFirebaseFields = requiredFields.filter(
    (field) => !firebaseConfig[field]?.trim(),
);

let firebaseApp = null;
let auth = null;
let rtdb = null;
let firebaseSetupError = null;

if (missingFirebaseFields.length === 0) {
    try {
        firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
        auth = createAuth(firebaseApp);
        if (firebaseConfig.databaseURL?.trim()) {
            rtdb = getDatabase(firebaseApp, firebaseConfig.databaseURL);
        }
    } catch (error) {
        firebaseSetupError = error;
    }
}

export { firebaseApp, auth, rtdb, firebaseSetupError };
