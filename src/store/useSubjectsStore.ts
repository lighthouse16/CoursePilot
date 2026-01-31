import { create } from "zustand";

export interface Subject {
  id: string;
  name: string;
  nextDue: string;
  mastery: number;
}

interface SubjectsStore {
  subjects: Subject[];
  addSubject: (name: string) => void;
  removeSubject: (id: string) => void;
  resetToDefaults: () => void;
}

const defaultSubjects: Subject[] = [
  {
    id: "comp1011",
    name: "COMP1011",
    nextDue: "Today",
    mastery: 72,
  },
  {
    id: "dsai1103",
    name: "DSAI1103",
    nextDue: "Tomorrow",
    mastery: 85,
  },
  {
    id: "af1605",
    name: "AF1605",
    nextDue: "Feb 3",
    mastery: 64,
  },
];

export const useSubjectsStore = create<SubjectsStore>((set) => ({
  subjects: defaultSubjects,
  addSubject: (name) =>
    set((state) => ({
      subjects: [
        ...state.subjects,
        {
          id: `subject-${Date.now()}`,
          name,
          nextDue: "Not scheduled",
          mastery: 0,
        },
      ],
    })),
  removeSubject: (id) =>
    set((state) => ({
      subjects: state.subjects.filter((s) => s.id !== id),
    })),
  resetToDefaults: () =>
    set({
      subjects: defaultSubjects,
    }),
}));
