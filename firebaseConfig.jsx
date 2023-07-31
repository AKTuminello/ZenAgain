import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_NATIVE_API_KEY,
  authDomain: process.env.REACT_NATIVE_AUTH_DOMAIN,
  projectId: process.env.REACT_NATIVE_PROJECT_ID,
  storageBucket: process.env.REACT_NATIVE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_NATIVE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_NATIVE_APP_ID,
};

let app;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getFirestore(app);

export { db };