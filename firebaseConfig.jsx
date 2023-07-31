import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

import {
  REACT_NATIVE_API_KEY,
  REACT_NATIVE_AUTH_DOMAIN,
  REACT_NATIVE_PROJECT_ID,
  REACT_NATIVE_STORAGE_BUCKET,
  REACT_NATIVE_MESSAGING_SENDER_ID,
  REACT_NATIVE_APP_ID,
} from '@env';

const firebaseConfig = {
  apiKey: REACT_NATIVE_API_KEY,
  authDomain: REACT_NATIVE_AUTH_DOMAIN,
  projectId: REACT_NATIVE_PROJECT_ID,
  storageBucket: REACT_NATIVE_STORAGE_BUCKET,
  messagingSenderId: REACT_NATIVE_MESSAGING_SENDER_ID,
  appId: REACT_NATIVE_APP_ID,
};

let app;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getFirestore(app);

export { db };
