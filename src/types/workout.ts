// =============================================================
// src/types/workout.ts
// =============================================================

export type WorkoutCategory = 'strength' | 'cardio' | 'flexibility';

export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  durationSec?: number;
  orderIndex: number;
};

export type Workout = {
  id: string;
  title: string;
  category: WorkoutCategory;
  duration: number;
  exercises: Exercise[];
  scheduledAt: string;
  completedAt?: string;
  notes?: string;
};
