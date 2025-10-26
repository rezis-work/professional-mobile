import { useState } from "react";
import { ScrollView, View, StyleSheet, RefreshControl } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { NotificationCard } from "../components/NotificationCard";
import { Pagination } from "@/components/Pagination";
import { useGetNotifications } from "../../hooks/use-get-notifications";

export function NotificationsListView() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error, refetch, isRefetching } = useGetNotifications(
    page,
    limit
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ThemedText>Loading notifications...</ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <ThemedText>Error loading notifications</ThemedText>
        <ThemedText style={styles.errorMessage}>
          {error instanceof Error ? error.message : "Unknown error"}
        </ThemedText>
      </View>
    );
  }

  if (!data || !data.notifications.length) {
    return (
      <View style={styles.centerContainer}>
        <ThemedText>No notifications found</ThemedText>
      </View>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorMessage: {
    marginTop: 8,
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
  },
});
