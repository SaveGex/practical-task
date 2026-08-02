import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Crypto from "expo-crypto";
import { Directory, File, Paths } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import {
  deleteProgressPhoto,
  getAllProgressPhotos,
  insertProgressPhoto,
} from "../db/queries/progressPhotos";
const QUERY_KEY = ["progress_photos"];

export function useProgressPhotos() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      return await getAllProgressPhotos();
    },
  });
}

export function usePhotoSourcePicker() {
  const pickImage = async (useCamera: boolean): Promise<string | null> => {
    let result: ImagePicker.ImagePickerResult;

    if (useCamera) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Camera access is required to take progress photos.",
        );
        return null;
      }

      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 0.8,
        allowsEditing: true,
      });
    } else {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Media library access is required to choose photos.",
        );
        return null;
      }

      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.8,
        allowsEditing: true,
      });
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      return result.assets[0].uri;
    }

    return null;
  };

  const showPicker = (onSelectUri: (uri: string) => void) => {
    Alert.alert("Add Progress Photo", "Choose photo source:", [
      {
        text: "Camera",
        onPress: async () => {
          const uri = await pickImage(true);
          if (uri) onSelectUri(uri);
        },
      },
      {
        text: "Gallery",
        onPress: async () => {
          const uri = await pickImage(false);
          if (uri) onSelectUri(uri);
        },
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  return { showPicker };
}

export function useAddProgressPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pickerUri: string) => {
      const fileName = `progress_${Date.now()}.jpg`;

      const sourceFile = new File(pickerUri);

      const targetDirectory = new Directory(Paths.document);
      const destinationFile = new File(targetDirectory, fileName);

      sourceFile.copy(destinationFile);

      const newPhoto = {
        id: Crypto.randomUUID(),
        uri: destinationFile.uri,
        created_at: new Date().toISOString(),
      };

      await insertProgressPhoto(newPhoto);
      return newPhoto;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      Alert.alert("Error", "Failed to save the progress photo.");
      console.error(error);
    },
  });
}

export function useDeleteProgressPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, uri }: { id: string; uri: string }) => {
      await deleteProgressPhoto(id);

      try {
        const photoFile = new File(uri);
        if (photoFile.exists) {
          photoFile.delete();
        }
      } catch (e) {
        console.warn("Could not delete photo file from disk:", e);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      Alert.alert("Error", "Failed to delete the progress photo.");
      console.error(error);
    },
  });
}
