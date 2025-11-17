import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ReviewStatus } from "../../types";
import { useTranslation } from "react-i18next";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";

interface StatusFilterProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

export function StatusFilter({
  selectedStatus,
  onStatusChange,
}: StatusFilterProps) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const tint = useThemeColor(
    { light: "#3B82F6", dark: "#2563EB" },
    "tint"
  );
  const inactiveBg = useThemeColor(
    { light: "#FFFFFF", dark: "#1F2937" },
    "background"
  );
  const inactiveBorder = useThemeColor(
    { light: "#E5E7EB", dark: "#374151" },
    "text"
  );
  const inactiveText = useThemeColor(
    { light: "#6B7280", dark: "#9CA3AF" },
    "text"
  );

  const statuses = [
    { label: t("reviews.all"), value: ReviewStatus.UNDEFINED, icon: "list" },
    { label: t("common.pending"), value: ReviewStatus.PENDING, icon: "time" },
    { label: t("common.approved"), value: ReviewStatus.APPROVED, icon: "checkmark-circle" },
    { label: t("common.rejected"), value: ReviewStatus.REJECTED, icon: "close-circle" },
  ];

  return (
    <View style={styles.container}>
      {statuses.map((status) => {
        const isActive = selectedStatus === status.value;
        return (
          <TouchableOpacity
            key={status.value}
            style={[
              styles.chip,
              isActive
                ? [styles.chipActive, { backgroundColor: tint, borderColor: tint }]
                : [
                    styles.chipInactive,
                    {
                      backgroundColor: inactiveBg,
                      borderColor: inactiveBorder,
                    },
                  ],
            ]}
            onPress={() => onStatusChange(status.value)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={status.icon as any}
              size={14}
              color={isActive ? "#FFFFFF" : inactiveText}
            />
            <ThemedText
              style={styles.chipText}
              lightColor={isActive ? "#FFFFFF" : "#1F2937"}
              darkColor={isActive ? "#FFFFFF" : "#E5E7EB"}
            >
              {status.label}
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
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexWrap: "wrap",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  chipActive: {},
  chipInactive: {},
  chipText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
