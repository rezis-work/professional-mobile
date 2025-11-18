import { Pagination } from "@/components/Pagination";
import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import useThemeColorPalette from "@/hooks/use-theme-color-palette";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useGetNotifications } from "../../hooks/use-get-notifications";
import { NotificationCard } from "../components/NotificationCard";

export function NotificationsListView() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const tint = useThemeColor({}, "tint");
  const errorColor = useThemeColor({}, "error");
  const mutedIcon = useThemeColor({}, "mutedIcon");
  const colors = useThemeColorPalette();

  const { data, isLoading, error, refetch, isRefetching } = useGetNotifications(
    page,
    limit
  );

  if (isLoading) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
      >
        <ActivityIndicator size="large" color={tint} />
        <ThemedText style={styles.loadingText}>
          Loading notifications...
        </ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
      >
        <Ionicons name="alert-circle" size={48} color={errorColor} />
        <ThemedText style={styles.errorTitle}>
          Error loading notifications
        </ThemedText>
        <ThemedText style={styles.errorMessage}>
          {error instanceof Error ? error.message : "Unknown error"}
        </ThemedText>
      </View>
    );
  }

  if (!data || !data.notifications.length) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
      >
        <Ionicons name="notifications-off" size={48} color={mutedIcon} />
        <ThemedText style={styles.emptyText}>No notifications found</ThemedText>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        showsVerticalScrollIndicator={false}
      >
        {data.notifications.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} />
        ))}
      </ScrollView>
      <Pagination
        totalcount={data.pagination.total}
        limit={Number(data.pagination.limit)}
        currentPage={page}
        onPageChange={setPage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    opacity: 0.7,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
  },
  errorMessage: {
    marginTop: 8,
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 12,
  },
});
