import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import type { Notification } from "../../types";
import { useMarkAsRead } from "../../hooks/use-mark-as-read";

interface NotificationCardProps {
  notification: Notification;
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const { mutate: markAsRead, isPending } = useMarkAsRead();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleMarkAsRead = () => {
    markAsRead(notification.id);
  };

  return (
    <ThemedView
      style={[
        styles.container,
        notification.read ? styles.readContainer : styles.unreadContainer,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.indicator,
              notification.read ? styles.readIndicator : styles.unreadIndicator,
            ]}
          />
          <ThemedText style={styles.title} numberOfLines={2}>
            {notification.title || notification.type.replace(/_/g, " ")}
          </ThemedText>
        </View>
        <ThemedText style={styles.date}>
          {formatDate(notification.createdAt)}
        </ThemedText>
      </View>

      <ThemedText style={styles.message} numberOfLines={3}>
        {notification.message}
      </ThemedText>

      {notification.data && Object.keys(notification.data).length > 0 && (
        <View style={styles.dataContainer}>
          {notification.data.leadId && (
            <View style={styles.dataRow}>
              <ThemedText style={styles.dataLabel}>Lead ID:</ThemedText>
              <ThemedText style={styles.dataValue}>
                {notification.data.leadId}
              </ThemedText>
            </View>
          )}
          {notification.data.amount && (
            <View style={styles.dataRow}>
              <ThemedText style={styles.dataLabel}>Amount:</ThemedText>
              <ThemedText style={styles.dataValue}>
                {notification.data.amount} ₾
              </ThemedText>
            </View>
          )}
          {notification.data.clientName && (
            <View style={styles.dataRow}>
              <ThemedText style={styles.dataLabel}>Client:</ThemedText>
              <ThemedText style={styles.dataValue}>
                {notification.data.clientName}
              </ThemedText>
            </View>
          )}
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.button,
          notification.read ? styles.readButton : styles.unreadButton,
        ]}
        onPress={handleMarkAsRead}
        disabled={isPending || notification.read}
        activeOpacity={0.7}
      >
        <ThemedText style={styles.buttonText}>
          {notification.read ? "Marked" : "Mark as Read"}
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  readContainer: {
    backgroundColor: "#f9fafb",
  },
  unreadContainer: {
    backgroundColor: "#eff6ff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 8,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  readIndicator: {
    backgroundColor: "#9ca3af",
  },
  unreadIndicator: {
    backgroundColor: "#3b82f6",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
  },
  date: {
    fontSize: 12,
    opacity: 0.6,
  },
  message: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  dataContainer: {
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  dataLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  dataValue: {
    fontSize: 12,
    fontWeight: "600",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-end",
  },
  readButton: {
    backgroundColor: "#e5e7eb",
  },
  unreadButton: {
    backgroundColor: "#3b82f6",
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
