import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { NotificationsListView } from "@/modules/master/notifications/ui/views/NotificationsListView";
import { UnreadCount } from "@/modules/master/notifications/ui/components/UnreadCount";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function NotificationsScreen() {
  const backgroundColor = useThemeColor(
    { light: "#F3F4F6", dark: "#000000" },
    "background"
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Notifications
        </ThemedText>
        <UnreadCount />
      </View>
      <NotificationsListView />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
});
