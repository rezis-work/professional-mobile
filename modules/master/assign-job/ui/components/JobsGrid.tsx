import { ThemedText } from "@/components/themed-text";
import { TouchableOpacity, View, StyleSheet, Platform } from "react-native";
import type { Job } from "../../types";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";

export function JobsGrid({
  jobs,
  onSelect,
}: {
  jobs: Job[];
  onSelect: (job: Job) => void;
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
      {jobs.map((job) => (
        <TouchableOpacity
          key={job.id}
          onPress={() => onSelect(job)}
          style={[
            styles.card,
            { backgroundColor: cardBg, borderColor },
            isDark && styles.cardDark,
          ]}
          activeOpacity={0.7}
        >
          <View style={styles.header}>
            <Ionicons name="briefcase" size={20} color={tint} />
            <ThemedText type="subtitle" style={styles.title} numberOfLines={2}>
              {job.title.en}
            </ThemedText>
          </View>
          <ThemedText style={styles.description} numberOfLines={3}>
            {job.description.en}
          </ThemedText>
          <View style={styles.footer}>
            <View style={styles.footerItem}>
              <Ionicons name="people" size={14} color="#6B7280" />
              <ThemedText style={styles.footerText}>
                {job.masterCount} masters
              </ThemedText>
            </View>
          </View>
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
    gap: 12,
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
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  title: {
    flex: 1,
  },
  description: {
    fontSize: 12,
    opacity: 0.7,
    lineHeight: 16,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.05)",
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  footerText: {
    fontSize: 11,
    opacity: 0.7,
  },
});
