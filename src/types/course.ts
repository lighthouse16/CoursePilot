export interface Term {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface Course {
  id: string;
  termId: string;
  code: string;
  title: string;
  description?: string;
  color: string;
  targetGrade?: string;
  examDate?: string;
  createdAt: string;
}

export interface Unit {
  id: string;
  courseId: string;
  title: string;
  weekNumber?: number;
  date?: string;
  createdAt: string;
}

export type MaterialKind = "pdf" | "slides" | "notes" | "link";

export interface Material {
  id: string;
  courseId: string;
  unitId?: string;
  title: string;
  kind: MaterialKind;
  createdAt: string;
}

export interface Concept {
  id: string;
  courseId: string;
  unitId: string;
  title: string;
  bullets: string[];
  weak: boolean;
  createdAt: string;
}

export interface Flashcard {
  id: string;
  courseId: string;
  unitId: string;
  conceptId: string;
  front: string;
  back: string;
  createdAt: string;
}

export interface PracticeQ {
  id: string;
  courseId: string;
  unitId: string;
  conceptId: string;
  prompt: string;
  createdAt: string;
}

export type ReviewItemType = "flashcard" | "concept";
export type ReviewResult = "correct" | "incorrect";

export interface ReviewItem {
  id: string;
  courseId: string;
  unitId: string;
  type: ReviewItemType;
  refId: string;
  dueAt: string;
  intervalDays: number;
  ease: number;
  lastResult?: ReviewResult;
  streak: number;
}

export interface User {
  name: string;
  email?: string;
  createdAt: string;
}

export function nowIso(): string {
  return new Date().toISOString();
}
