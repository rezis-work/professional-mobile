import { View, StyleSheet, TouchableOpacity, Platform, ActivityIndicator } from "react-native";
import { ThemedText } from "@/components/themed-text";
import type { Notification } from "../../types";
import { useMarkAsRead } from "../../hooks/use-mark-as-read";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";

interface NotificationCardProps {
  notification: Notification;
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const { mutate: markAsRead, isPending } = useMarkAsRead();
  const cardBg = useThemeColor({}, "cardBackground");
  const borderColor = useThemeColor({}, "border");
  const tint = useThemeColor({}, "tint");
  const unreadBadge = useThemeColor({}, "unreadBadge");
  const mutedIcon = useThemeColor({}, "mutedIcon");
  const secondaryBackground = useThemeColor({}, "secondaryBackground");
  const success = useThemeColor({}, "success");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleMarkAsRead = () => {
    markAsRead(notification.id);
  };

  const getNotificationIcon = () => {
    if (notification.type.includes("lead")) return "briefcase";
    if (notification.type.includes("payment") || notification.type.includes("billing")) return "cash";
    if (notification.type.includes("review")) return "star";
    return "notifications";
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: cardBg,
          borderColor: notification.read ? borderColor : tint,
          borderLeftWidth: notification.read ? 1.5 : 4,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: notification.read
                  ? `${mutedIcon}1A`
                  : `${unreadBadge}1A`,
              },
            ]}
          >
            <Ionicons
              name={getNotificationIcon() as any}
              size={20}
              color={notification.read ? mutedIcon : tint}
            />
          </View>
          <View style={styles.headerText}>
            <ThemedText style={styles.title} numberOfLines={2}>
              {notification.title || notification.type.replace(/_/g, " ")}
            </ThemedText>
            <ThemedText style={styles.date}>
              {formatDate(notification.createdAt)}
            </ThemedText>
          </View>
        </View>
        {!notification.read && (
          <View style={[styles.unreadBadge, { backgroundColor: unreadBadge }]}>
            <View style={[styles.unreadDot, { backgroundColor: unreadBadge }]} />
          </View>
        )}
      </View>

      <ThemedText style={styles.message} numberOfLines={3}>
        {notification.message}
      </ThemedText>

      {notification.data && Object.keys(notification.data).length > 0 && (
        <View style={[styles.dataContainer, { backgroundColor: secondaryBackground }]}>
          {notification.data.leadId && (
            <View style={styles.dataRow}>
              <Ionicons name="document-text" size={14} color={mutedIcon} />
              <ThemedText style={styles.dataLabel}>Lead ID:</ThemedText>
              <ThemedText style={styles.dataValue}>
                {notification.data.leadId}
              </ThemedText>
            </View>
          )}
          {notification.data.amount && (
            <View style={styles.dataRow}>
              <Ionicons name="cash" size={14} color={success} />
              <ThemedText style={styles.dataLabel}>Amount:</ThemedText>
              <ThemedText style={[styles.dataValue, { color: success }]}>
                {notification.data.amount} ₾
              </ThemedText>
            </View>
          )}
          {notification.data.clientName && (
            <View style={styles.dataRow}>
              <Ionicons name="person" size={14} color={mutedIcon} />
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
          {
            backgroundColor: notification.read ? borderColor : tint,
          },
          (isPending || notification.read) && styles.buttonDisabled,
        ]}
        onPress={handleMarkAsRead}
        disabled={isPending || notification.read}
        activeOpacity={0.7}
      >
        {isPending ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <>
            <Ionicons
              name={notification.read ? "checkmark-circle" : "checkmark-circle-outline"}
              size={16}
              color={notification.read ? mutedIcon : "#FFFFFF"}
            />
            <ThemedText
              style={[
                styles.buttonText,
                notification.read
                  ? { color: mutedIcon }
                  : { color: "#FFFFFF" },
              ]}
              lightColor={notification.read ? mutedIcon : "#FFFFFF"}
              darkColor={notification.read ? mutedIcon : "#FFFFFF"}
            >
              {notification.read ? "Marked" : "Mark as Read"}
            </ThemedText>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 0,
  },
  date: {
    fontSize: 12,
    opacity: 0.6,
  },
  unreadBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  message: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
    opacity: 0.8,
  },
  dataContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  dataRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dataLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  dataValue: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: "auto",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: "flex-end",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
