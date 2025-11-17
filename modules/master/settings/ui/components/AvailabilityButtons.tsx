import { ThemedText } from "@/components/themed-text";
import { TouchableOpacity, View, StyleSheet, Platform } from "react-native";
import { useTranslation } from "react-i18next";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";

export type Availability = "now" | "tomorrow" | "next_week" | "on_holiday";

export function AvailabilityButtons({
  value,
  onSelect,
}: {
  value: Availability;
  onSelect: (value: Availability) => void;
}) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const tint = useThemeColor({}, "tint");
  const inactiveBg = useThemeColor(
    { light: "#F3F4F6", dark: "#111827" },
    "background"
  );
  const inactiveText = useThemeColor(
    { light: "#6B7280", dark: "#9CA3AF" },
    "text"
  );
  const keys: Availability[] = ["now", "tomorrow", "next_week", "on_holiday"];

  const getLabel = (key: string) => {
    const labelMap: Record<string, string> = {
      now: t("settings.availabilityNow"),
      tomorrow: t("settings.availabilityTomorrow"),
      next_week: t("settings.availabilityNextWeek"),
      on_holiday: t("settings.availabilityOnHoliday"),
    };
    return labelMap[key] || key;
  };

  const getIcon = (key: string) => {
    const iconMap: Record<string, string> = {
      now: "flash",
      tomorrow: "calendar",
      next_week: "calendar-outline",
      on_holiday: "sunny",
    };
    return iconMap[key] || "time";
  };

  const getColor = (key: string) => {
    const colorMap: Record<string, string> = {
      now: "#10B981",
      tomorrow: "#F59E0B",
      next_week: "#3B82F6",
      on_holiday: "#6B7280",
    };
    return colorMap[key] || tint;
  };

  return (
    <View style={styles.container}>
      {keys.map((key) => {
        const isActive = value === key;
        const color = getColor(key);
        return (
          <TouchableOpacity
            key={key}
            onPress={() => onSelect(key)}
            style={[
              styles.button,
              isActive
                ? [styles.activeButton, { backgroundColor: color }]
                : [styles.inactiveButton, { backgroundColor: inactiveBg }],
            ]}
            activeOpacity={0.7}
          >
            <Ionicons
              name={getIcon(key) as any}
              size={18}
              color={isActive ? "#FFFFFF" : inactiveText}
            />
            <ThemedText
              style={[
                styles.buttonText,
                isActive ? styles.activeButtonText : { color: inactiveText },
              ]}
            >
              {getLabel(key)}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  button: {
    flex: 1,
    minWidth: "47%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  activeButton: {
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
  inactiveButton: {
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  activeButtonText: {
    color: "#FFFFFF",
  },
});
