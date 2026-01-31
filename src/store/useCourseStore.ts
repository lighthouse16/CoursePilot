import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface Material {
  id: string;
  title: string;
  type?: string;
}

export interface Concept {
  id: string;
  title: string;
  notes?: string;
}

export interface Unit {
  id: string;
  title: string;
  materials: Material[];
  concepts: Concept[];
}

export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  units: Unit[];
}

interface CourseState {
  courses: Course[];
  addCourse: (course: Course) => void;
  updateCourse: (courseId: string, updates: Partial<Course>) => void;
  addUnit: (courseId: string, unit: Unit) => void;
  updateUnit: (
    courseId: string,
    unitId: string,
    updates: Partial<Unit>,
  ) => void;
}

export const useCourseStore = create<CourseState>()(
  persist(
    (set, get) => ({
      courses: [],
      addCourse: (course) => {
        const state = get();
        set({ courses: [...state.courses, course] });
      },
      updateCourse: (courseId, updates) => {
        const state = get();
        set({
          courses: state.courses.map((course) =>
            course.id === courseId ? { ...course, ...updates } : course,
          ),
        });
      },
      addUnit: (courseId, unit) => {
        const state = get();
        set({
          courses: state.courses.map((course) =>
            course.id === courseId
              ? { ...course, units: [...course.units, unit] }
              : course,
          ),
        });
      },
      updateUnit: (courseId, unitId, updates) => {
        const state = get();
        set({
          courses: state.courses.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  units: course.units.map((unit) =>
                    unit.id === unitId ? { ...unit, ...updates } : unit,
                  ),
                }
              : course,
          ),
        });
      },
    }),
    {
      name: "course-store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
