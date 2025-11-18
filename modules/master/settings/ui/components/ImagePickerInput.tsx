import { ThemedText } from "@/components/themed-text";
import * as ExpoImagePicker from "expo-image-picker";
import {
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  Platform,
} from "react-native";
import type { UseFormSetValue } from "react-hook-form";
import type { ProfileFormValues } from "../../schema";
import { useTranslation } from "react-i18next";
import { useThemeColorPalette } from "@/hooks/use-theme-color-palette";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useToast } from "@/components/toast";
import { Ionicons } from "@expo/vector-icons";

export function ImagePickerInput({
  setValue,
  uri,
}: {
  setValue: UseFormSetValue<ProfileFormValues>;
  uri?: string;
}) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = useThemeColorPalette();

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Ionicons name="image" size={16} color={colors.mutedIcon} />
        <ThemedText style={styles.label}>{t("settings.profileImage")}</ThemedText>
      </View>
      <View style={styles.content}>
        {uri ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri }} style={styles.image} />
            <TouchableOpacity
              style={[styles.removeButton, { backgroundColor: colors.cardBackground }]}
              onPress={() => setValue("image", null, { shouldValidate: false })}
            >
              <Ionicons name="close-circle" size={24} color={colors.error} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.placeholder, { borderColor: colors.border }]}>
            <Ionicons name="camera" size={32} color={colors.mutedIcon} />
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
              showToast(t("settings.permissionRequired"), "warning");
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
          style={[styles.pickButton, { backgroundColor: colors.primary }]}
          activeOpacity={0.7}
        >
          <Ionicons name="image-outline" size={18} color={colors.white} />
          <ThemedText style={[styles.pickButtonText, { color: colors.white }]} lightColor={colors.white} darkColor={colors.white}>
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
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
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
    fontSize: 14,
    fontWeight: "600",
  },
});
