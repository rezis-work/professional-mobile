import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { useGetUnreadCount } from "../../hooks/use-get-unread-count";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useColorScheme } from "@/hooks/use-color-scheme";

export function UnreadCount() {
  const { data, isLoading } = useGetUnreadCount();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const badgeBg = useThemeColor(
    { light: "#FEE2E2", dark: "#7F1D1D" },
    "background"
  );

  if (isLoading || !data) {
    return null;
  }

  if (data.unreadCount === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.badge, { backgroundColor: badgeBg }]}>
        <View style={styles.indicator} />
        <ThemedText style={styles.text} lightColor="#DC2626" darkColor="#FCA5A5">
          {data.unreadCount}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    backgroundColor: "#EF4444",
    borderRadius: 4,
  },
  text: {
    fontSize: 13,
    fontWeight: "700",
  },
});
