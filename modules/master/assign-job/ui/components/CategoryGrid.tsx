import { ThemedText } from "@/components/themed-text";
import { TouchableOpacity, View, StyleSheet, Platform } from "react-native";
import type { Category } from "../../types";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";

export function CategoryGrid({
  categories,
  onSelect,
}: {
  categories: Category[];
  onSelect: (category: Category) => void;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const cardBg = useThemeColor(
    { light: "#FFFFFF", dark: "#1F2937" },
    "background"
  );
  const tint = useThemeColor(
    { light: "#3B82F6", dark: "#2563EB" },
    "tint"
  );
  const borderColor = useThemeColor(
    { light: "#E5E7EB", dark: "#374151" },
    "text"
  );

  return (
    <View style={styles.grid}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          onPress={() => onSelect(category)}
          style={[
            styles.card,
            { backgroundColor: cardBg, borderColor },
            isDark && styles.cardDark,
          ]}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="folder" size={24} color={tint} />
          </View>
          <ThemedText type="subtitle" style={styles.title}>
            {category.name.en}
          </ThemedText>
          <ThemedText style={styles.subtitle} numberOfLines={1}>
            {category.name.ka}
          </ThemedText>
          {typeof category.jobCount === "number" && (
            <View style={styles.jobCountContainer}>
              <Ionicons name="briefcase" size={14} color={tint} />
              <ThemedText style={[styles.jobCount, { color: tint }]}>
                {category.jobCount} jobs
              </ThemedText>
            </View>
          )}
        </TouchableOpacity>
      ))}
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
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardDark: {
    borderWidth: 1,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
  },
  jobCountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    marginTop: 4,
  },
  jobCount: {
    fontSize: 12,
    fontWeight: "600",
  },
});
