import { getApp, getApps, initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Oplysningerne læses fra .env.local og bruges til at finde Firebase-projektet.
// Demoen bruger kun databasen; der er ikke login.
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
};

// Opret kun forbindelsen, når databaseadressen er udfyldt.
let rtdb = null;

if (firebaseConfig.databaseURL) {
    // Samme opsætning som i undervisningen: genbrug appen, hvis den allerede findes.
    const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
    rtdb = getDatabase(firebaseApp, firebaseConfig.databaseURL);
}

export { rtdb };
