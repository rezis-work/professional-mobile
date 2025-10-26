import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { useGetUnreadCount } from "../../hooks/use-get-unread-count";

export function UnreadCount() {
  const { data, isLoading } = useGetUnreadCount();

  if (isLoading || !data) {
    return null;
  }

  if (data.unreadCount === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <View style={styles.indicator} />
        <ThemedText style={styles.text}>{data.unreadCount}</ThemedText>
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
    backgroundColor: "#fee2e2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    backgroundColor: "#ef4444",
    borderRadius: 4,
  },
  text: {
    fontSize: 14,
    fontWeight: "700",
  },
});
