

import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getReactNativePersistence } from 'firebase/auth/react-native';


const firebaseConfig = {
  apiKey: "AIzaSyAGwJ5wuWZ68RsBFfi48I-eFAy0tr0xkHw",
  authDomain: "raktaamrut.firebaseapp.com",
  projectId: "raktaamrut",
  storageBucket: "raktaamrut.firebasestorage.app",
  messagingSenderId: "364631726250",
  appId: "1:364631726250:web:af241eae8d3fc6b6ec58d3",
  measurementId: "G-7RQZZB4RCG"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
export default app;