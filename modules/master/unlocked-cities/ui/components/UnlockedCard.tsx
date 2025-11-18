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
import { useThemeColorPalette } from "@/hooks/use-theme-color-palette";

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
  const colors = useThemeColorPalette();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        },
        isDark && styles.cardDark,
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.locationIcon, { backgroundColor: `${colors.primary}1A` }]}>
            <Ionicons name="location" size={18} color={colors.primary} />
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
            { backgroundColor: city.isActive ? colors.availabilityNow : colors.mutedIcon },
          ]}
        >
          <Ionicons
            name={city.isActive ? "checkmark" : "close"}
            size={10}
            color={colors.white}
          />
        </View>
      </View>

      {/* Details */}
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <View style={styles.detailIconContainer}>
            <Ionicons name="trophy" size={13} color={colors.warning} />
          </View>
          <ThemedText style={styles.detailText} numberOfLines={1}>
            {city.unlockCost} pts
          </ThemedText>
        </View>
        <View style={styles.detailItem}>
          <View style={styles.detailIconContainer}>
            <Ionicons name="calendar-outline" size={13} color={colors.mutedIcon} />
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
          { 
            backgroundColor: colors.error,
            shadowColor: colors.error,
          },
          isPending && styles.removeButtonDisabled,
        ]}
        activeOpacity={0.7}
      >
        {isPending ? (
          <ActivityIndicator color={colors.white} size="small" />
        ) : (
          <>
            <Ionicons name="trash-outline" size={13} color={colors.white} />
              <ThemedText
                style={styles.removeButtonText}
                lightColor={colors.white}
                darkColor={colors.white}
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
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 4,
    ...Platform.select({
      ios: {
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
