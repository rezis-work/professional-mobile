import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { NotificationsListView } from "@/modules/master/notifications/ui/views/NotificationsListView";
import { UnreadCount } from "@/modules/master/notifications/ui/components/UnreadCount";

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
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
    paddingBottom: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
});
