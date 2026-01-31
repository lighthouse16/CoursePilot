import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    Concept,
    Course,
    Flashcard,
    Material,
    PracticeQ,
    ReviewItem,
    Term,
    Unit,
    User,
} from "../types/course";

export interface AppState {
  version: number;
  user: User | null;
  firebaseUserId: string | null;
  syncInProgress: boolean;
  terms: Term[];
  courses: Course[];
  units: Unit[];
  materials: Material[];
  concepts: Concept[];
  flashcards: Flashcard[];
  practiceQs: PracticeQ[];
  reviewItems: ReviewItem[];
  lastSeeded: boolean;
}

const STORAGE_KEY = "@CoursePilot:state";
const CURRENT_VERSION = 1;

export const getInitialState = (): AppState => ({
  version: CURRENT_VERSION,
  user: null,
  firebaseUserId: null,
  syncInProgress: false,
  terms: [],
  courses: [],
  units: [],
  materials: [],
  concepts: [],
  flashcards: [],
  practiceQs: [],
  reviewItems: [],
  lastSeeded: false,
});

export async function loadState(): Promise<AppState> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json) {
      const parsed = JSON.parse(json);
      const loadedState = { ...getInitialState(), ...parsed };

      // Version migration logic
      if (!loadedState.version || loadedState.version < CURRENT_VERSION) {
        console.log(
          `Migrating from version ${loadedState.version || 0} to ${CURRENT_VERSION}`,
        );
        loadedState.version = CURRENT_VERSION;
        // Future migrations would go here
        // if (loadedState.version === 1) { /* migrate to v2 */ }
      }

      return loadedState;
    }
  } catch (err) {
    console.error("Failed to load state:", err);
    // If JSON is corrupted, clear storage and start fresh
    await AsyncStorage.removeItem(STORAGE_KEY);
  }
  return getInitialState();
}

export async function saveState(state: AppState): Promise<void> {
  try {
    const json = JSON.stringify(state);
    await AsyncStorage.setItem(STORAGE_KEY, json);
  } catch (err) {
    console.error("Failed to save state:", err);
    // On iOS, this could be a quota issue
    // On Android, might be permissions
    // For now, we log but don't crash the app
  }
}

export async function clearState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear state:", err);
  }
}
