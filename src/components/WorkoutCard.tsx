import type { Workout } from "@/src/types/workout";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import {
    BORDER_RADIUS,
    COLORS,
    FONT_SIZE,
    SHADOW,
    SPACING,
} from "../constants/theme";

type Props = {
  workout: Workout;
  onPress: (workout: Workout) => void;
  onDelete: (workout: Workout) => void;
  onComplete: (workout: Workout) => void;
};

const SWIPE_THRESHOLD = 60;
const ZONE_WIDTH = 80;
const COMPLETE_WIDTH = -ZONE_WIDTH;

const WorkoutCard = ({ workout, onPress, onDelete, onComplete }: Props) => {
  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);
  const isOpen = useSharedValue(false);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // Анімація для лівої кнопки (Видалення)
  const deleteAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, ZONE_WIDTH],
      [0, 1],
      "clamp"
    ),
    transform: [
      {
        scale: interpolate(
          translateX.value,
          [0, ZONE_WIDTH],
          [0.7, 1],
          "clamp"
        ),
      },
    ],
  }));

  // Анімація для правої кнопки (Завершення)
  const completeAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, COMPLETE_WIDTH],
      [0, 1],
      "clamp"
    ),
    transform: [
      {
        scale: interpolate(
          translateX.value,
          [0, COMPLETE_WIDTH],
          [0.7, 1],
          "clamp"
        ),
      },
    ],
  }));

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onStart(() => {
      startX.value = translateX.value;
    })
    .onUpdate((event) => {
      const rawTranslation = startX.value + event.translationX;
      translateX.value = Math.max(
        COMPLETE_WIDTH,
        Math.min(rawTranslation, ZONE_WIDTH)
      );
    })
    .onEnd(() => {
      if (translateX.value > SWIPE_THRESHOLD) {
        translateX.value = withSpring(ZONE_WIDTH);
        isOpen.value = true;
      } else if (translateX.value < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(COMPLETE_WIDTH);
        isOpen.value = true;
      } else {
        translateX.value = withSpring(0);
        isOpen.value = false;
      }
    });

  return (
    <View style={styles.container}>
      {/* Ліва дія: Видалення (Видно при свайпі вправо) */}
      <Animated.View style={[styles.deleteAction, deleteAnimatedStyle]}>
        <Pressable style={styles.deleteBtn} onPress={onDelete(workout)}>
          <Ionicons name="trash-outline" size={24} color="#fff" />
        </Pressable>
      </Animated.View>

      {/* Права дія: Завершення (Видно при свайпі вліво) */}
      <Animated.View style={[styles.completeAction, completeAnimatedStyle]}>
        <Pressable style={styles.completeBtn} onPress={onComplete(workout)}>
          <Ionicons name="checkmark-outline" size={24} color="#fff" />
        </Pressable>
      </Animated.View>

      {/* Верхня картка з жестом */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={cardAnimatedStyle}>
          <Pressable onPress={() => onPress(workout)} style={styles.card}>
            <View style={styles.body}>
              <Text style={styles.title}>{workout.title}</Text>
              <Text
                style={[
                  styles.badge,
                  { backgroundColor: COLORS[workout.category] },
                ]}
              >
                {workout.category}
              </Text>
            </View>
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: "hidden",
    ...Platform.select({
      ios: { ...SHADOW.sm },
      android: { elevation: 2 },
    }),
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
  accent: {
    width: 4,
    alignSelf: "stretch",
  },
  body: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  title: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
  },
  badgeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "500",
  },
  metaRow: {
    flexDirection: "row",
    gap: SPACING.lg,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  arrow: {
    marginRight: SPACING.md,
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: COLORS.error,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteAction: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: SPACING.md,
    width: ZONE_WIDTH,
    borderRadius: BORDER_RADIUS.lg,
    overflow: "hidden",
  },
  completeBtn: {
    flex: 1,
    backgroundColor: COLORS.success,
    alignItems: "center",
    justifyContent: "center",
  },
  completeAction: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: SPACING.md,
    width: ZONE_WIDTH,
    borderRadius: BORDER_RADIUS.lg,
    overflow: "hidden",
  },
});

export default WorkoutCard;