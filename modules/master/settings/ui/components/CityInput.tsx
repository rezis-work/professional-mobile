import { ThemedText } from "@/components/themed-text";
import { TextInput, View, StyleSheet, Platform } from "react-native";
import type { UseFormSetValue } from "react-hook-form";
import type { ProfileFormValues } from "../../schema";
import { useTranslation } from "react-i18next";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";

export function CityInput({
  setValue,
  error,
  defaultValue,
}: {
  setValue: UseFormSetValue<ProfileFormValues>;
  error?: string;
  defaultValue?: string;
}) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const borderColor = useThemeColor(
    { light: error ? "#EF4444" : "#E5E7EB", dark: error ? "#EF4444" : "#374151" },
    "text"
  );
  const textColor = useThemeColor({}, "text");
  const placeholderColor = useThemeColor(
    { light: "#9CA3AF", dark: "#6B7280" },
    "text"
  );
  const backgroundColor = useThemeColor(
    { light: "#F9FAFB", dark: "#111827" },
    "background"
  );

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Ionicons name="location" size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
        <ThemedText style={styles.label}>{t("settings.city")}</ThemedText>
      </View>
      <View
        style={[
          styles.inputContainer,
          { borderColor, backgroundColor },
          isDark && styles.inputContainerDark,
        ]}
      >
        <TextInput
          placeholder={t("settings.enterCity")}
          placeholderTextColor={placeholderColor}
          defaultValue={defaultValue}
          onChangeText={(t) => setValue("city", t, { shouldValidate: true })}
          style={[styles.input, { color: textColor }]}
        />
      </View>
      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={14} color="#EF4444" />
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      ) : null}
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    ...Platform.select({
      ios: {
        paddingVertical: 0,
      },
      android: {
        paddingVertical: 0,
      },
    }),
  },
  inputContainerDark: {
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
    ...Platform.select({
      ios: {
        paddingVertical: 0,
      },
      android: {
        paddingVertical: 0,
        textAlignVertical: "center",
      },
    }),
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
  },
});
