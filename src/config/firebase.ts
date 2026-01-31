import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDX8KERU3v_3pQ5GdGBF7mXSBp6dGcm43M",
  authDomain: "coursepilot-b243c.firebaseapp.com",
  projectId: "coursepilot-b243c",
  storageBucket: "coursepilot-b243c.firebasestorage.app",
  messagingSenderId: "95342859172",
  appId: "1:95342859172:web:c37e81ebd04faf5c12e731",
  measurementId: "G-Q6Z41H88L8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth and Firestore
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);

export default app;
