import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const workouts = sqliteTable("workouts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category", {
    enum: ["strength", "cardio", "flexibility"],
  }).notNull(),
  duration: int("duration").notNull(),
  scheduledAt: text("scheduled_at").notNull(),
  completedAt: text("completed_at"),
  notes: text("notes"),
  createdAt: text("created_at").notNull(),
});


export const exercises = sqliteTable("exercises", {
  id: text("id").primaryKey(),
  workoutId: text("workout_id")
    .notNull()
    .references(() => workouts.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  sets: int("sets").notNull(),
  reps: int("reps").notNull(),
  weight: int("weight"),
  durationSec: int("duration_sec"),
  orderIndex: int("order_index").notNull(),
});

export const progress_photos = sqliteTable("progress_photos", {
  id: text("id").primaryKey(),
  uri: text("uri").notNull(),
  created_at: text("created_at").notNull(),
});

export type WorkoutRow = typeof workouts.$inferSelect;
export type NewWorkout = typeof workouts.$inferInsert;
export type ExerciseRow = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;
export type ProgressPhotoRow = typeof progress_photos.$inferSelect;
export type NewProgressPhoto = typeof progress_photos.$inferInsert;
