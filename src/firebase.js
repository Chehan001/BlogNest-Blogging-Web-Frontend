import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBJvV-veV1g5cUi5AqKV-GapA7oe3yPCYQ",
  authDomain: "blognest-11401.firebaseapp.com",
  projectId: "blognest-11401",
  storageBucket: "blognest-11401.firebasestorage.app",
  messagingSenderId: "1045287226658",
  appId: "1:1045287226658:web:d4fb550ed53d0d50f7a97b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
