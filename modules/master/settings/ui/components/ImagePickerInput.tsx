import { ThemedText } from "@/components/themed-text";
import * as ExpoImagePicker from "expo-image-picker";
import { TouchableOpacity, View, Image, Alert } from "react-native";
import type { UseFormSetValue } from "react-hook-form";
import type { ProfileFormValues } from "../../schema";

export function ImagePickerInput({
  setValue,
  uri,
}: {
  setValue: UseFormSetValue<ProfileFormValues>;
  uri?: string;
}) {
  return (
    <View style={{ gap: 8 }}>
      <ThemedText>Profile Image</ThemedText>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <TouchableOpacity
          onPress={async () => {
            const { status } =
              await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
              Alert.alert(
                "Permission required",
                "We need media permissions to pick an image."
              );
              return;
            }
            const result = await ExpoImagePicker.launchImageLibraryAsync({
              quality: 0.8,
              allowsEditing: true,
              selectionLimit: 1,
            });
            if (!result.canceled) {
              const asset = result.assets[0];
              const name = asset.fileName || `photo_${Date.now()}.jpg`;
              const type = asset.mimeType || "image/jpeg";
              setValue(
                "image",
                { uri: asset.uri, name, type },
                { shouldValidate: false }
              );
            }
          }}
          style={{
            backgroundColor: "#2D5BE3",
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 8,
          }}
        >
          <ThemedText style={{ color: "white" }}>Pick Image</ThemedText>
        </TouchableOpacity>
      </View>
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: 96, height: 96, borderRadius: 8, marginTop: 8 }}
        />
      ) : null}
    </View>
  );
}
