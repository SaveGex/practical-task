import AddWorkoutModal from '@/src/components/addWorkoutModal';
import WorkoutCard from '@/src/components/WorkoutCard';
import { COLORS } from '@/src/constants/theme';
import { useDeleteWorkout, useUpdateWorkout, useWorkouts } from '@/src/hooks/useWorkouts';
import { useUIStore } from '@/src/store/uiStore';
import type { Workout } from '@/src/types/workout';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

const HomeScreen = () => {
  const { data: workouts, isLoading, isError } = useWorkouts();
  
  // Використовуємо mutate замість mutateAsync
  const { mutate: deleteWorkout } = useDeleteWorkout();
  const { mutate: completeWorkout } = useUpdateWorkout();

  const router = useRouter();

  const handleWorkoutPress = (workout: Workout) => {
    router.push({ pathname: "/workout/[id]", params: { id: workout.id } });
  };

  const handleDeleteWorkout = (workout: Workout) => {
    deleteWorkout({ workoutId: workout.id });
  };

  const handleCompleteWorkout = (workout: Workout) => {
    completeWorkout({
      workoutId: workout.id,
      data: { completedAt: new Date().toISOString() },
    });
  };

  // Modal store
  const isModalOpen = useUIStore((state) => state.isAddWorkoutModalOpen);
  const closeModal = useUIStore((state) => state.closeAddWorkoutModal);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Завантаження...</Text>
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>Помилка завантаження даних</Text>
        </View>
      ) : (
        <FlatList
          data={workouts ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={workouts?.length === 0 ? styles.center : styles.listContent}
          renderItem={({ item }) => (
            <WorkoutCard
              workout={item}
              onPress={handleWorkoutPress}
              onDelete={handleDeleteWorkout}
              onComplete={handleCompleteWorkout}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Тренувань поки немає</Text>
          }
        />
      )}

      <AddWorkoutModal visible={isModalOpen} onClose={closeModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
  },
  errorText: {
    color: 'red',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
});

export default HomeScreen;