import { MOCK_WORKOUTS } from "../constants/mockData";
import { db } from "./client";
import { exercises, workouts } from "./schema";

export const seedDatabase = async () => {
  // 1. Додано await, щоб отримати результат, а не Promise
  const existing = await db.select().from(workouts).get();
  if (existing) {
    console.log("DB already seeded");
    return;
  }

  console.log("Seeding...");

  await db.transaction(async (tx) => {
    // 2. Підготовка масиву тренувань для пакетної вставки
    const workoutsToInsert = MOCK_WORKOUTS.map((workout) => ({
      id: workout.id,
      title: workout.title,
      category: workout.category,
      duration: workout.duration,
      scheduledAt: workout.scheduledAt,
      completedAt: workout.completedAt ?? null,
      notes: workout.notes ?? null,
      createdAt: new Date().toISOString(),
    }));

    await tx.insert(workouts).values(workoutsToInsert);

    // 3. Збір усіх вправ з усіх тренувань в один масив
    const allExercises = MOCK_WORKOUTS.flatMap((workout) =>
      workout.exercises.map((ex, index) => ({
        id: ex.id,
        workoutId: workout.id,
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight ?? null,
        durationSec: ex.durationSec ?? null,
        // Зберігаємо оригінальний orderIndex, якщо він є
        orderIndex: ex.orderIndex ?? index,
      }))
    );

    if (allExercises.length > 0) {
      await tx.insert(exercises).values(allExercises);
    }
  });

  console.log("End Seeding...");
};