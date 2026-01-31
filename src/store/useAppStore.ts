import { create } from "zustand";
import { seedInitialState } from "../data/seed";
import {
    AppState,
    getInitialState,
    loadState,
    saveState,
} from "../data/storage";
import {
    signOut as firebaseSignOut,
    signInWithEmail,
    signUpWithEmail,
} from "../services/firebase-auth";
import {
    loadStateFromFirebase,
    mergeStates,
    saveStateToFirebase,
} from "../services/firebase-sync";
import {
    Concept,
    Course,
    Flashcard,
    Material,
    MaterialKind,
    PracticeQ,
    ReviewItem,
    ReviewResult,
    Unit,
    User,
    nowIso,
} from "../types/course";

interface AppStore extends AppState {
  initialized: boolean;
  loading: boolean;
  firebaseUserId: string | null;
  syncInProgress: boolean;
  init: () => Promise<void>;
  signIn: (user: Omit<User, "createdAt">) => Promise<void>;
  signInWithFirebase: (
    email: string,
    password: string,
    displayName?: string,
    isSignUp?: boolean,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  syncWithFirebase: () => Promise<void>;
  addCourse: (params: { code: string; title: string; termId: string }) => void;
  updateCourse: (courseId: string, updates: Partial<Course>) => void;
  addUnit: (courseId: string, title: string) => void;
  updateUnit: (unitId: string, updates: Partial<Unit>) => void;
  addMaterial: (
    courseId: string,
    unitId: string | undefined,
    title: string,
    kind: MaterialKind,
  ) => void;
  generateStudyPack: (courseId: string, unitId: string) => void;
  getTodayQueue: () => ReviewItem[];
  recordReviewResult: (reviewItemId: string, result: ReviewResult) => void;
  resetDemo: () => Promise<void>;
  coursesForTerm: (termId: string) => Course[];
  unitsForCourse: (courseId: string) => Unit[];
  courseById: (id: string) => Course | undefined;
  unitById: (id: string) => Unit | undefined;
}

export const useAppStore = create<AppStore>((set, get) => ({
  ...getInitialState(),
  initialized: false,
  loading: false,
  firebaseUserId: null,
  syncInProgress: false,

  init: async () => {
    if (get().initialized) return;
    set({ loading: true });
    try {
      let state = await loadState();
      state = seedInitialState(state);
      await saveState(state);
      set({ ...state, initialized: true, loading: false });
    } catch (err) {
      console.error("Failed to initialize:", err);
      set({ loading: false });
    }
  },

  signIn: async (userData) => {
    const state = get();
    const user: User = {
      ...userData,
      createdAt: nowIso(),
    };
    const newState = { ...state, user };
    set(newState);
    await saveState(newState);
  },

  signOut: async () => {
    const state = get();

    // Sign out from Firebase if authenticated
    if (state.firebaseUserId) {
      try {
        await firebaseSignOut();
      } catch (err) {
        console.error("Failed to sign out from Firebase:", err);
      }
    }

    const newState = { ...state, user: null, firebaseUserId: null };
    set(newState);
    await saveState(newState);
  },

  signInWithFirebase: async (
    email,
    password,
    displayName,
    isSignUp = false,
  ) => {
    set({ loading: true });
    try {
      let authResult;

      if (isSignUp) {
        // User explicitly wants to sign up, create new account
        if (!displayName) {
          throw new Error("Display name required for new accounts");
        }
        authResult = await signUpWithEmail(email, password, displayName);
      } else {
        // Try to sign in first, if fails, sign up
        try {
          authResult = await signInWithEmail(email, password);
        } catch (signInError: any) {
          if (
            signInError.code === "auth/user-not-found" ||
            signInError.code === "auth/wrong-password"
          ) {
            // User doesn't exist, create new account
            if (!displayName) {
              throw new Error("Display name required for new accounts");
            }
            authResult = await signUpWithEmail(email, password, displayName);
          } else {
            throw signInError;
          }
        }
      }

      const firebaseUser = authResult.user;
      const isNewUser = authResult.isNewUser;

      // Create local user object
      const user: User = {
        name: firebaseUser.displayName || displayName || "User",
        email: firebaseUser.email || email,
        createdAt: nowIso(),
      };

      let mergedState;

      if (isNewUser) {
        // For new users, start with a clean initial state
        const initialState = getInitialState();
        mergedState = {
          ...initialState,
          user,
          firebaseUserId: firebaseUser.uid,
        };
      } else {
        // For existing users, load and merge states
        const remoteState = await loadStateFromFirebase(firebaseUser.uid);
        const localState = await loadState();
        mergedState = await mergeStates(localState, remoteState);
        mergedState = {
          ...mergedState,
          user,
          firebaseUserId: firebaseUser.uid,
        };
      }

      // Save merged state locally and to Firebase
      await saveState(mergedState);
      await saveStateToFirebase(firebaseUser.uid, mergedState);

      set({ ...mergedState, loading: false });
    } catch (err) {
      console.error("Firebase sign-in failed:", err);
      set({ loading: false });
      throw err;
    }
  },

  syncWithFirebase: async () => {
    const state = get();
    if (!state.firebaseUserId) {
      console.log("No Firebase user, skipping sync");
      return;
    }

    if (state.syncInProgress) {
      console.log("Sync already in progress");
      return;
    }

    set({ syncInProgress: true });
    try {
      await saveStateToFirebase(state.firebaseUserId, state);
      console.log("Synced to Firebase successfully");
    } catch (err) {
      console.error("Failed to sync with Firebase:", err);
    } finally {
      set({ syncInProgress: false });
    }
  },

  addCourse: ({ code, title, termId }) => {
    const state = get();
    const id = `course-${Date.now()}`;
    const course: Course = {
      id,
      termId,
      code,
      title,
      color: "#6366F1",
      createdAt: nowIso(),
    };
    const newState = { ...state, courses: [...state.courses, course] };
    set(newState);
    saveState(newState);
  },

  updateCourse: (courseId, updates) => {
    const state = get();
    const newState = {
      ...state,
      courses: state.courses.map((c) =>
        c.id === courseId ? { ...c, ...updates } : c,
      ),
    };
    set(newState);
    saveState(newState);
  },

  addUnit: (courseId, title) => {
    const state = get();
    const id = `unit-${Date.now()}`;
    const existingUnits = state.units.filter((u) => u.courseId === courseId);
    const weekNumber = existingUnits.length + 1;
    const unit: Unit = {
      id,
      courseId,
      title,
      weekNumber,
      createdAt: nowIso(),
    };
    const newState = { ...state, units: [...state.units, unit] };
    set(newState);
    saveState(newState);
  },

  updateUnit: (unitId, updates) => {
    const state = get();
    const newState = {
      ...state,
      units: state.units.map((u) =>
        u.id === unitId ? { ...u, ...updates } : u,
      ),
    };
    set(newState);
    saveState(newState);
  },

  addMaterial: (courseId, unitId, title, kind) => {
    const state = get();
    const id = `material-${Date.now()}`;
    const material: Material = {
      id,
      courseId,
      unitId,
      title,
      kind,
      createdAt: nowIso(),
    };
    const newState = { ...state, materials: [...state.materials, material] };
    set(newState);
    saveState(newState);
  },

  generateStudyPack: (courseId, unitId) => {
    const state = get();
    const now = nowIso();
    const ts = Date.now();

    const concepts: Concept[] = [];
    const flashcards: Flashcard[] = [];
    const practiceQs: PracticeQ[] = [];
    const reviewItems: ReviewItem[] = [];

    for (let i = 1; i <= 6; i++) {
      const conceptId = `concept-${ts}-${i}`;
      concepts.push({
        id: conceptId,
        courseId,
        unitId,
        title: `Concept ${i}`,
        bullets: [`Key point ${i}.1`, `Key point ${i}.2`],
        weak: false,
        createdAt: now,
      });

      for (let j = 1; j <= 2; j++) {
        const flashcardId = `flashcard-${ts}-${i}-${j}`;
        flashcards.push({
          id: flashcardId,
          courseId,
          unitId,
          conceptId,
          front: `Question ${i}.${j}?`,
          back: `Answer ${i}.${j}`,
          createdAt: now,
        });

        reviewItems.push({
          id: `review-${ts}-${i}-${j}`,
          courseId,
          unitId,
          type: "flashcard",
          refId: flashcardId,
          dueAt: now,
          intervalDays: 1,
          ease: 2.5,
          streak: 0,
        });
      }
    }

    for (let i = 1; i <= 5; i++) {
      const conceptId = concepts[i % concepts.length].id;
      practiceQs.push({
        id: `practice-${ts}-${i}`,
        courseId,
        unitId,
        conceptId,
        prompt: `Practice question ${i}`,
        createdAt: now,
      });
    }

    const newState = {
      ...state,
      concepts: [...state.concepts, ...concepts],
      flashcards: [...state.flashcards, ...flashcards],
      practiceQs: [...state.practiceQs, ...practiceQs],
      reviewItems: [...state.reviewItems, ...reviewItems],
    };
    set(newState);
    saveState(newState);
  },

  getTodayQueue: () => {
    const state = get();
    const now = new Date().toISOString();
    return state.reviewItems
      .filter((item) => item.dueAt <= now)
      .sort((a, b) => a.dueAt.localeCompare(b.dueAt));
  },

  recordReviewResult: (reviewItemId, result) => {
    const state = get();
    const item = state.reviewItems.find((r) => r.id === reviewItemId);
    if (!item) return;

    let newInterval = item.intervalDays;
    let newEase = item.ease;
    let newStreak = item.streak;

    if (result === "correct") {
      newStreak += 1;
      newInterval = Math.round(item.intervalDays * item.ease);
      if (newInterval < 3) newInterval = 3;
      newEase = Math.min(3.0, item.ease + 0.1);
    } else {
      newStreak = 0;
      newInterval = 1;
      newEase = Math.max(1.3, item.ease - 0.2);

      const concept = state.concepts.find(
        (c) =>
          c.id === item.refId ||
          state.flashcards.find((f) => f.id === item.refId)?.conceptId === c.id,
      );

      if (concept && !concept.weak) {
        const updatedConcepts = state.concepts.map((c) =>
          c.id === concept.id ? { ...c, weak: true } : c,
        );

        const extraReviewItems: ReviewItem[] = [];
        const relatedFlashcards = state.flashcards.filter(
          (f) => f.conceptId === concept.id,
        );
        for (let i = 0; i < Math.min(2, relatedFlashcards.length); i++) {
          const fc = relatedFlashcards[i];
          if (
            !state.reviewItems.find(
              (r) => r.refId === fc.id && r.dueAt <= nowIso(),
            )
          ) {
            extraReviewItems.push({
              id: `review-extra-${Date.now()}-${i}`,
              courseId: fc.courseId,
              unitId: fc.unitId,
              type: "flashcard",
              refId: fc.id,
              dueAt: nowIso(),
              intervalDays: 1,
              ease: 2.5,
              streak: 0,
            });
          }
        }

        const newState = {
          ...state,
          concepts: updatedConcepts,
          reviewItems: [
            ...state.reviewItems.filter((r) => r.id !== reviewItemId),
            {
              ...item,
              dueAt: new Date(
                Date.now() + newInterval * 24 * 60 * 60 * 1000,
              ).toISOString(),
              intervalDays: newInterval,
              ease: newEase,
              lastResult: result,
              streak: newStreak,
            },
            ...extraReviewItems,
          ],
        };
        set(newState);
        saveState(newState);
        return;
      }
    }

    const dueAt = new Date(
      Date.now() + newInterval * 24 * 60 * 60 * 1000,
    ).toISOString();

    const newState = {
      ...state,
      reviewItems: state.reviewItems.map((r) =>
        r.id === reviewItemId
          ? {
              ...r,
              dueAt,
              intervalDays: newInterval,
              ease: newEase,
              lastResult: result,
              streak: newStreak,
            }
          : r,
      ),
    };
    set(newState);
    saveState(newState);
  },

  resetDemo: async () => {
    const state = getInitialState();
    const seeded = seedInitialState(state);
    await saveState(seeded);
    set({ ...seeded, initialized: true });
  },

  coursesForTerm: (termId) => {
    return get().courses.filter((c) => c.termId === termId);
  },

  unitsForCourse: (courseId) => {
    return get().units.filter((u) => u.courseId === courseId);
  },

  courseById: (id) => {
    return get().courses.find((c) => c.id === id);
  },

  unitById: (id) => {
    return get().units.find((u) => u.id === id);
  },
}));
