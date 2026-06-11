import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAX66ZugQkapm035m_p2qf74s4YJ8GOyhA",
  authDomain: "layalina-2c1e3.firebaseapp.com",
  projectId: "layalina-2c1e3",
  storageBucket: "layalina-2c1e3.firebasestorage.app",
  messagingSenderId: "895774585533",
  appId: "1:895774585533:web:b56bb129cf3cde5f35bdd4",
  measurementId: "G-X8QWHPREW3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();