import { ThemedText } from "@/components/themed-text";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColorPalette } from "@/hooks/use-theme-color-palette";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import type { CityPart } from "../../types";

export function CityPartsGrid({
  parts,
  onUnlock,
  unlockingPartId,
}: {
  parts: CityPart[];
  onUnlock: (part: CityPart) => void;
  unlockingPartId: string | null;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = useThemeColorPalette();

  return (
    <View style={styles.grid}>
      {parts.map((part) => {
        const isUnlocking = unlockingPartId === part.id;
        return (
          <View
            key={part.id}
            style={[
              styles.card,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              },
              isDark && styles.cardDark,
            ]}
          >
            <View style={styles.header}>
              <Ionicons name="location" size={16} color={colors.primary} />
              <ThemedText
                type="subtitle"
                style={styles.partName}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {part.name}
              </ThemedText>
            </View>
            <View
              style={[
                styles.costContainer,
                { backgroundColor: `${colors.warning}1A` },
              ]}
            >
              <Ionicons name="trophy" size={14} color={colors.warning} />
              <ThemedText
                style={[styles.costText, { color: colors.warning }]}
                numberOfLines={1}
              >
                {part.unlockCost} pts
              </ThemedText>
            </View>
            <TouchableOpacity
              onPress={() => onUnlock(part)}
              disabled={isUnlocking}
              style={[
                styles.unlockButton,
                { backgroundColor: colors.primary },
                isUnlocking && styles.unlockButtonDisabled,
              ]}
              activeOpacity={0.7}
            >
              {isUnlocking ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <>
                  <Ionicons name="lock-open" size={14} color={colors.white} />
                  <ThemedText
                    style={styles.unlockButtonText}
                    lightColor={colors.white}
                    darkColor={colors.white}
                    numberOfLines={1}
                  >
                    Unlock ({part.unlockCost})
                  </ThemedText>
                </>
              )}
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    width: "47%",
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 12,
    gap: 10,
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
    gap: 6,
  },
  partName: {
    flex: 1,
    fontSize: 14,
  },
  costContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 6,
    borderRadius: 6,
    flexShrink: 1,
  },
  costText: {
    fontSize: 11,
    fontWeight: "600",
    flexShrink: 1,
  },
  unlockButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 10,
    borderRadius: 10,
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
  unlockButtonDisabled: {
    opacity: 0.6,
  },
  unlockButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
