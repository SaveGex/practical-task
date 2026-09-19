import { WorkoutCategory } from "@/src/types/workout";
import { desc, eq } from "drizzle-orm";
import { db } from "../client";
import { exercises, NewExercise, NewWorkout, workouts } from "../schema";

// READ
export const getAllWorkouts = () => {
  return db.select().from(workouts).orderBy(desc(workouts.scheduledAt));
};

export const getWorkoutsByCategory = (category: WorkoutCategory) => {
  return db
    .select()
    .from(workouts)
    .where(eq(workouts.category, category))
    .orderBy(desc(workouts.scheduledAt));
};

export const getWorkoutById = (id: string) => {
  return db
    .select()
    .from(workouts)
    .where(eq(workouts.id, id))
    .orderBy(desc(workouts.scheduledAt))
    .get();
};

export const getExercisesByWorkoutId = (workoutId: string) => {
  return db
    .select()
    .from(exercises)
    .where(eq(exercises.workoutId, workoutId))
    .orderBy(desc(exercises.orderIndex));
};

// CREATE

export const insertWorkout = (data: NewWorkout) => {
  return db.insert(workouts).values(data);
};

export const insertWorkoutWithExercises = (
  workoutData: NewWorkout,
  exercisesData: Omit<NewExercise, "workoutId">[],
) => {
  return db.transaction(async (tx) => {
    await tx.insert(workouts).values(workoutData);
    if (exercisesData.length > 0) {
      await tx.insert(exercises).values(
        exercisesData.map((ex, index) => ({
          ...ex,
          workoutId: workoutData.id as string,
          orderIndex: index,
        })),
      );
    }
  });
};

export function updateWorkout(id: string, data: Partial<NewWorkout>) {
  return db.update(workouts).set(data).where(eq(workouts.id, id));
}

export function completeWorkout(id: string) {
  return db
    .update(workouts)
    .set({ completedAt: new Date().toISOString() })
    .where(eq(workouts.id, id));
}

export function deleteWorkout(id: string) {
  return db.delete(workouts).where(eq(workouts.id, id));
}