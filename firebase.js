import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { 
  getFirestore, collection, addDoc, getDocs, getDoc, doc, query, where, 
  setDoc, updateDoc, deleteDoc 
} from "firebase/firestore"; // 🔥 প্রয়োজনীয় ফাংশন যুক্ত করা হয়েছে

const firebaseConfig = {
  apiKey: "AIzaSyCpwyr5An0_Ui1GAwynLhTGFCU9SFiKuJ8",
  authDomain: "my-react-authapp.firebaseapp.com",
  projectId: "my-react-authapp",
  storageBucket: "my-react-authapp.appspot.com", // 🔥 সঠিকভাবে সংশোধন করা হয়েছে
  messagingSenderId: "1081237349456",
  appId: "1:1081237349456:web:aff10f858083f4a9d0dd55"
};

// Firebase অ্যাপ ইনিশিয়ালাইজ করা
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Firestore ডাটাবেজ সংযুক্ত করা
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, db, collection, addDoc, getDocs, getDoc, doc, query, where, setDoc, updateDoc, deleteDoc }; // 🔥 নতুন Firestore ফাংশন এক্সপোর্ট করা হয়েছে
