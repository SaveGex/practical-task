import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { ProgressPhotoRow } from "../db/schema";
import {
    useAddProgressPhoto,
    useDeleteProgressPhoto,
    usePhotoSourcePicker,
    useProgressPhotos,
} from "../hooks/useProgressPhotos";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = (width - 32 - 12) / 2;

export default function ProgressPhotoGallery() {
  const { data: photos, isLoading, error } = useProgressPhotos();
  const { showPicker } = usePhotoSourcePicker();
  const addMutation = useAddProgressPhoto();
  const deleteMutation = useDeleteProgressPhoto();

  const handleAddPhoto = () => {
    showPicker((pickerUri) => {
      addMutation.mutate(pickerUri);
    });
  };

  const handleDeletePhoto = (photo: ProgressPhotoRow) => {
    Alert.alert(
      "Видалення фото",
      "Ви впевнені, що хочете видалити це фото з галереї?",
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Видалити",
          style: "destructive",
          onPress: () =>
            deleteMutation.mutate({ id: photo.id, uri: photo.uri }),
        },
      ],
    );
  };

  const renderPhotoItem = ({ item }: { item: ProgressPhotoRow }) => (
    <View style={styles.photoContainer}>
      <Image
        source={{ uri: item.uri }}
        style={styles.photo}
        contentFit="cover"
      />
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeletePhoto(item)}
        activeOpacity={0.7}
      >
        <Ionicons name="trash" size={16} color="#FFFFFF" />
      </TouchableOpacity>
      <View style={styles.dateBadge}>
        <Text style={styles.dateText}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="images-outline" size={48} color="#8E8E93" />
      <Text style={styles.emptyTitle}>Немає фотографій</Text>
      <Text style={styles.emptySubtext}>
        Додайте першу фотографію вашого прогресу, щоб відстежувати результати
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Хедер із кнопкою додавання */}
      <View style={styles.header}>
        <Text style={styles.title}>Фото прогресу</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddPhoto}
          disabled={addMutation.isPending}
        >
          {addMutation.isPending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Додати</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Контент галереї */}
      {isLoading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : error ? (
        <Text style={styles.errorText}>Помилка завантаження фотографій</Text>
      ) : (
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id}
          renderItem={renderPhotoItem}
          numColumns={2}
          columnWrapperStyle={
            photos && photos.length > 0 ? styles.columnWrapper : undefined
          }
          ListEmptyComponent={renderEmptyState}
          scrollEnabled={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    marginTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  photoContainer: {
    width: COLUMN_WIDTH,
    height: COLUMN_WIDTH * 1.3,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#E5E5EA",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  deleteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 59, 48, 0.85)",
    padding: 6,
    borderRadius: 20,
  },
  dateBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dateText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: 20,
  },
  errorText: {
    color: "#FF3B30",
    textAlign: "center",
    marginTop: 10,
  },
});
