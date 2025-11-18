import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet, View } from "react-native";
import { useGetUnreadCount } from "../../hooks/use-get-unread-count";

export function UnreadCount() {
  const { data, isLoading } = useGetUnreadCount();
  const badgeBg = useThemeColor({}, "notificationBadgeBg");
  const badgeText = useThemeColor({}, "notificationBadgeText");
  const errorColor = useThemeColor({}, "error");

  if (isLoading || !data) {
    return null;
  }

  if (data.unreadCount === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.badge, { backgroundColor: badgeBg }]}>
        <View style={[styles.indicator, { backgroundColor: errorColor }]} />
        <ThemedText
          style={styles.text}
          lightColor={badgeText}
          darkColor={badgeText}
        >
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
    borderRadius: 4,
  },
  text: {
    fontSize: 13,
    fontWeight: "700",
  },
});
