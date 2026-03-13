import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCcp1rSTXeqrpETPv1ifb52iEkUhCsL49A",
  authDomain: "dev-ecom-test-010126.firebaseapp.com",
  projectId: "dev-ecom-test-010126",
  storageBucket: "dev-ecom-test-010126.firebasestorage.app",
  messagingSenderId: "717616470424",
  appId: "1:717616470424:web:3a926d60fcc4acc920f3ed"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
connectAuthEmulator(auth, "http://127.0.0.1:9099");
connectFirestoreEmulator(db, "127.0.0.1", 8080);
connectStorageEmulator(storage, "127.0.0.1", 9199);