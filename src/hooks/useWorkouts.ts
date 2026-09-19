import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteWorkout, getAllWorkouts, getExercisesByWorkoutId, getWorkoutById, insertWorkoutWithExercises, updateWorkout } from "../db/queries/workouts";
import { NewExercise, NewWorkout } from "../db/schema";
import { queryClient } from "../providers/QueryProvider";

export const useWorkouts = () => { 
  return useQuery({
    queryKey: ["workouts"],
    queryFn: async () => {
      const data = await getAllWorkouts();
      return data;
    },
  });
}

export const useWorkoutDetail = (id: string) => {
    return useQuery({
        queryKey: ["workout", id],
        queryFn: async() => {
            const workout = getWorkoutById(id);
            if (!workout) return null;
            const exs = await getExercisesByWorkoutId(id);
            return { ...workout, exercises: exs };
        },
        enabled: !!id
    })
}


export const useAddWorkout = () => {
    return useMutation({
      mutationFn: ({
        workout,
        exercises,
      }: {
        workout: NewWorkout;
        exercises: Omit<NewExercise, "workoutId">[];
      }) => insertWorkoutWithExercises(workout, exercises),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["workouts"] });
      },
    });
}

export const useUpdateWorkout = () => {
  return useMutation({
    mutationFn: ({
      workoutId,
      data,
    }: {
      workoutId: string;
      data: Partial<NewWorkout>;
    }) => updateWorkout(workoutId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });
}

export const useDeleteWorkout = () => {
  return useMutation({
    mutationFn: ({
      workoutId
    }: {
      workoutId: string
    }) => deleteWorkout(workoutId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    }
  });
}

