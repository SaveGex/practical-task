import ProgressPhotoGallery from "@/src/components/ProgressPhotoGallery";
import usePedometer from "@/src/hooks/usePedometer";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function ProgressScreen() {
  const { isAvailable, isPermissionGranted, steps, error } = usePedometer();

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.container}
    >
      {/* Секція крокоміра */}
      <View style={styles.pedometerCard}>
        <Text style={styles.pedometerTitle}>Крокомір</Text>
        {!isAvailable && (
          <Text style={styles.pedometerStatus}>
            {error ?? "Перевірка доступності крокоміра..."}
          </Text>
        )}
        {isAvailable && !isPermissionGranted && (
          <Text style={styles.pedometerStatus}>{error}</Text>
        )}
        {isAvailable && isPermissionGranted && (
          <Text style={styles.stepsText}>{steps} кроків</Text>
        )}
      </View>

      {/* Галерея фотографій прогресу */}
      <ProgressPhotoGallery />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    alignItems: "center",
    paddingVertical: 15,
  },
  pedometerCard: {
    width: "92%",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F2F2F7",
    alignItems: "center",
  },
  pedometerTitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 4,
  },
  pedometerStatus: {
    fontSize: 14,
    color: "#FF9500",
  },
  stepsText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000000",
  },
});