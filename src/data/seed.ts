import { AppState } from "./storage";

export function seedInitialState(state: AppState): AppState {
  // Don't seed any demo data - users start with a clean slate
  return { ...state, lastSeeded: true };
}
