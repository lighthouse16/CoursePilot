import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { AppState } from "../data/storage";

/**
 * Save app state to Firestore
 */
export async function saveStateToFirebase(
  userId: string,
  state: AppState,
): Promise<void> {
  const userDocRef = doc(db, "users", userId);

  await setDoc(
    userDocRef,
    {
      ...state,
      lastSyncedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

/**
 * Load app state from Firestore
 */
export async function loadStateFromFirebase(
  userId: string,
): Promise<AppState | null> {
  const userDocRef = doc(db, "users", userId);
  const docSnap = await getDoc(userDocRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    // Remove Firebase-specific fields
    const { lastSyncedAt, ...appState } = data;
    return appState as AppState;
  }

  return null;
}

/**
 * Merge local and remote state (simple last-write-wins for now)
 */
export async function mergeStates(
  localState: AppState,
  remoteState: AppState | null,
): Promise<AppState> {
  if (!remoteState) {
    return localState;
  }

  // Simple merge: use remote if it has more data
  // In production, you'd want more sophisticated conflict resolution
  const localItemCount =
    localState.courses.length +
    localState.units.length +
    localState.materials.length;

  const remoteItemCount =
    remoteState.courses.length +
    remoteState.units.length +
    remoteState.materials.length;

  return remoteItemCount > localItemCount ? remoteState : localState;
}
