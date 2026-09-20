const firebaseApiKey = globalThis.APP_CONFIG?.firebaseApiKey;

if (!firebaseApiKey) {
  throw new Error('Firebase configuration is missing APP_CONFIG.firebaseApiKey.');
}

export const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: "portfolio-01234.firebaseapp.com",
  projectId: "portfolio-01234",
  storageBucket: "portfolio-01234.firebasestorage.app",
  messagingSenderId: "222796924389",
  appId: "1:222796924389:web:ff64f964b662be7ac81b0c",
  measurementId: "G-1RM5G4SKSN"
};