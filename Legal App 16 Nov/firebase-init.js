import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDeC2_y5BELxq5TvU7R1GSuMIW76H9mS3o",
  authDomain: "legal-case-app-f74a7.firebaseapp.com",
  projectId: "legal-case-app-f74a7",
  storageBucket: "legal-case-app-f74a7.firebasestorage.app",
  messagingSenderId: "56245500286",
  appId: "1:56245500286:web:9a9e3bd133e55db1bc9b2f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
