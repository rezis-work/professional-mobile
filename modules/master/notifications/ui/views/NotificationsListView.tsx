import { useState } from "react";
import { ScrollView, View, StyleSheet, RefreshControl, ActivityIndicator } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { NotificationCard } from "../components/NotificationCard";
import { Pagination } from "@/components/Pagination";
import { useGetNotifications } from "../../hooks/use-get-notifications";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";

export function NotificationsListView() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const backgroundColor = useThemeColor(
    { light: "#F3F4F6", dark: "#000000" },
    "background"
  );
  const textColor = useThemeColor({}, "text");

  const { data, isLoading, error, refetch, isRefetching } = useGetNotifications(
    page,
    limit
  );

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor }]}>
        <ActivityIndicator size="large" color={isDark ? "#3B82F6" : "#2563EB"} />
        <ThemedText style={styles.loadingText}>Loading notifications...</ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centerContainer, { backgroundColor }]}>
        <Ionicons name="alert-circle" size={48} color="#EF4444" />
        <ThemedText style={styles.errorTitle}>Error loading notifications</ThemedText>
        <ThemedText style={styles.errorMessage}>
          {error instanceof Error ? error.message : "Unknown error"}
        </ThemedText>
      </View>
    );
  }

  if (!data || !data.notifications.length) {
    return (
      <View style={[styles.centerContainer, { backgroundColor }]}>
        <Ionicons name="notifications-off" size={48} color={isDark ? "#6B7280" : "#9CA3AF"} />
        <ThemedText style={styles.emptyText}>No notifications found</ThemedText>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
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
