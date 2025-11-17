import { ThemedText } from "@/components/themed-text";
import * as ExpoImagePicker from "expo-image-picker";
import {
  TouchableOpacity,
  View,
  Image,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";
import type { UseFormSetValue } from "react-hook-form";
import type { ProfileFormValues } from "../../schema";
import { useTranslation } from "react-i18next";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";

export function ImagePickerInput({
  setValue,
  uri,
}: {
  setValue: UseFormSetValue<ProfileFormValues>;
  uri?: string;
}) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const tint = useThemeColor(
    { light: "#3B82F6", dark: "#2563EB" },
    "tint"
  );
  const borderColor = useThemeColor(
    { light: "#E5E7EB", dark: "#374151" },
    "text"
  );

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Ionicons name="image" size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
        <ThemedText style={styles.label}>{t("settings.profileImage")}</ThemedText>
      </View>
      <View style={styles.content}>
        {uri ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => setValue("image", null, { shouldValidate: false })}
            >
              <Ionicons name="close-circle" size={24} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.placeholder, { borderColor }]}>
            <Ionicons name="camera" size={32} color={isDark ? "#6B7280" : "#9CA3AF"} />
            <ThemedText style={styles.placeholderText}>
              {t("settings.profileImage")}
            </ThemedText>
          </View>
        )}
        <TouchableOpacity
          onPress={async () => {
            const { status } =
              await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
              Alert.alert(t("common.error"), t("settings.permissionRequired"));
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
          style={[styles.pickButton, { backgroundColor: tint }]}
          activeOpacity={0.7}
        >
          <Ionicons name="image-outline" size={18} color="#FFFFFF" />
          <ThemedText style={styles.pickButtonText} lightColor="#FFFFFF" darkColor="#FFFFFF">
            {uri ? t("settings.pickImage") : t("settings.pickImage")}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    gap: 12,
  },
  imageContainer: {
    position: "relative",
    alignSelf: "flex-start",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  placeholderText: {
    fontSize: 10,
    opacity: 0.6,
    textAlign: "center",
  },
  pickButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: "flex-start",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  pickButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
