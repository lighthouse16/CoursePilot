import {
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    User as FirebaseUser,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import { auth } from "../config/firebase";

export interface AuthResult {
  user: FirebaseUser;
  isNewUser: boolean;
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string,
): Promise<AuthResult> {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  // Update display name
  if (userCredential.user) {
    await updateProfile(userCredential.user, { displayName });
  }

  return {
    user: userCredential.user,
    isNewUser: true,
  };
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
  email: string,
  password: string,
): Promise<AuthResult> {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );

  return {
    user: userCredential.user,
    isNewUser: false,
  };
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

/**
 * Get current authenticated user
 */
export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser;
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(
  callback: (user: FirebaseUser | null) => void,
): () => void {
  return onAuthStateChanged(auth, callback);
}
