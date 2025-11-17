import { ThemedText } from "@/components/themed-text";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import type { UnlockedCity } from "../../types";

export function UnlockedCard({
  city,
  isPending,
  onRemove,
  unlockedDate,
}: {
  city: UnlockedCity;
  isPending: boolean;
  onRemove: (cityPartId: string) => void;
  unlockedDate: string;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const cardBg = useThemeColor(
    { light: "#FFFFFF", dark: "#1F2937" },
    "background"
  );
  const borderColor = useThemeColor(
    { light: "#E5E7EB", dark: "#374151" },
    "text"
  );
  const tint = useThemeColor(
    { light: "#3B82F6", dark: "#2563EB" },
    "tint"
  );

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: cardBg,
          borderColor: borderColor,
        },
        isDark && styles.cardDark,
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.locationIcon, { backgroundColor: "rgba(59, 130, 246, 0.1)" }]}>
            <Ionicons name="location" size={18} color={tint} />
          </View>
          <View style={styles.headerText}>
            <ThemedText type="subtitle" style={styles.cityName} numberOfLines={1} ellipsizeMode="tail">
              {city.cityName}
            </ThemedText>
            <ThemedText style={styles.partName} numberOfLines={1} ellipsizeMode="tail">
              {city.cityPartName}
            </ThemedText>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: city.isActive ? "#10B981" : "#6B7280" },
          ]}
        >
          <Ionicons
            name={city.isActive ? "checkmark" : "close"}
            size={10}
            color="#FFFFFF"
          />
        </View>
      </View>

      {/* Details */}
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <View style={styles.detailIconContainer}>
            <Ionicons name="trophy" size={13} color="#F59E0B" />
          </View>
          <ThemedText style={styles.detailText} numberOfLines={1}>
            {city.unlockCost} pts
          </ThemedText>
        </View>
        <View style={styles.detailItem}>
          <View style={styles.detailIconContainer}>
            <Ionicons name="calendar-outline" size={13} color="#6B7280" />
          </View>
          <ThemedText style={styles.detailText} numberOfLines={1}>
            {unlockedDate}
          </ThemedText>
        </View>
      </View>

      {/* Remove Button */}
      <TouchableOpacity
        onPress={() => onRemove(city.cityPartId)}
        disabled={isPending}
        style={[
          styles.removeButton,
          isPending && styles.removeButtonDisabled,
        ]}
        activeOpacity={0.7}
      >
        {isPending ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <>
            <Ionicons name="trash-outline" size={13} color="#FFFFFF" />
            <ThemedText
              style={styles.removeButtonText}
              lightColor="#FFFFFF"
              darkColor="#FFFFFF"
            >
              Remove
            </ThemedText>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 14,
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardDark: {
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
    gap: 3,
  },
  cityName: {
    marginBottom: 0,
    fontSize: 15,
    fontWeight: "600",
  },
  partName: {
    fontSize: 12,
    opacity: 0.7,
  },
  statusBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  details: {
    flexDirection: "row",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.05)",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  detailIconContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    alignItems: "center",
    justifyContent: "center",
  },
  detailText: {
    fontSize: 12,
    opacity: 0.8,
    fontWeight: "500",
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#EF4444",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 4,
    ...Platform.select({
      ios: {
        shadowColor: "#EF4444",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  removeButtonDisabled: {
    opacity: 0.6,
  },
  removeButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
