import { ThemedText } from "@/components/themed-text";
import { useToast } from "@/components/toast";
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
import { useMarkAsRead } from "../../hooks/use-mark-as-read";
import type { Notification } from "../../types";

interface NotificationCardProps {
  notification: Notification;
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const { showToast } = useToast();
  const { mutate: markAsRead, isPending } = useMarkAsRead({
    onError: () => {
      showToast("Failed to mark notification as read", "error");
    },
  });
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = useThemeColorPalette();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleMarkAsRead = () => {
    markAsRead(notification.id);
  };

  const getNotificationIcon = () => {
    if (notification.type.includes("lead")) return "briefcase";
    if (
      notification.type.includes("payment") ||
      notification.type.includes("billing")
    )
      return "cash";
    if (notification.type.includes("review")) return "star";
    return "notifications";
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.cardBackground,
          borderColor: notification.read ? colors.border : colors.primary,
          borderLeftWidth: notification.read ? 1.5 : 4,
        },
        isDark && styles.cardDark,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: notification.read
                  ? `${colors.mutedIcon}1A`
                  : `${colors.primary}1A`,
              },
            ]}
          >
            <Ionicons
              name={getNotificationIcon() as any}
              size={20}
              color={notification.read ? colors.mutedIcon : colors.primary}
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
          <View
            style={[
              styles.unreadBadge,
              { backgroundColor: colors.unreadBadge },
            ]}
          >
            <View
              style={[
                styles.unreadDot,
                { backgroundColor: colors.unreadBadge },
              ]}
            />
          </View>
        )}
      </View>

      <ThemedText style={styles.message} numberOfLines={3}>
        {notification.message}
      </ThemedText>

      {notification.data && Object.keys(notification.data).length > 0 && (
        <View
          style={[
            styles.dataContainer,
            { backgroundColor: colors.secondaryBackground },
          ]}
        >
          {notification.data.leadId && (
            <View style={styles.dataRow}>
              <Ionicons
                name="document-text"
                size={14}
                color={colors.mutedIcon}
              />
              <ThemedText style={styles.dataLabel}>Lead ID:</ThemedText>
              <ThemedText style={styles.dataValue}>
                {notification.data.leadId}
              </ThemedText>
            </View>
          )}
          {notification.data.amount && (
            <View style={styles.dataRow}>
              <Ionicons name="cash" size={14} color={colors.success} />
              <ThemedText style={styles.dataLabel}>Amount:</ThemedText>
              <ThemedText style={[styles.dataValue, { color: colors.success }]}>
                {notification.data.amount} ₾
              </ThemedText>
            </View>
          )}
          {notification.data.clientName && (
            <View style={styles.dataRow}>
              <Ionicons name="person" size={14} color={colors.mutedIcon} />
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
            backgroundColor: notification.read ? colors.border : colors.primary,
          },
          (isPending || notification.read) && styles.buttonDisabled,
        ]}
        onPress={handleMarkAsRead}
        disabled={isPending || notification.read}
        activeOpacity={0.7}
      >
        {isPending ? (
          <ActivityIndicator
            color={notification.read ? colors.mutedIcon : colors.white}
            size="small"
          />
        ) : (
          <>
            <Ionicons
              name={
                notification.read
                  ? "checkmark-circle"
                  : "checkmark-circle-outline"
              }
              size={16}
              color={notification.read ? colors.mutedIcon : colors.white}
            />
            <ThemedText
              style={[
                styles.buttonText,
                notification.read
                  ? { color: colors.mutedIcon }
                  : { color: colors.white },
              ]}
              lightColor={notification.read ? colors.mutedIcon : colors.white}
              darkColor={notification.read ? colors.mutedIcon : colors.white}
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
  cardDark: {
    borderWidth: 1,
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
    minWidth: 120,
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
