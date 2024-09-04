import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "",
  authDomain: "trip4u-a4df1.firebaseapp.com",
  projectId: "trip4u-a4df1",
  storageBucket: "trip4u-a4df1.appspot.com",
  messagingSenderId: "",
  appId: "1",
  measurementId: "G-0L4QZDZ5Y5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const messaging = getMessaging(app);

export { db, auth, messaging };
