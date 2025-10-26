import { useState } from "react";
import { ScrollView, View, StyleSheet, RefreshControl } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ReviewCard } from "../components/ReviewCard";
import { StatusFilter } from "../components/StatusFilter";
import { Pagination } from "@/components/Pagination";
import { useGetMasterReviews } from "../../hooks/use-get-master-reviews";
import { ReviewStatus } from "../../types";

export function ReviewsListView() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>(ReviewStatus.UNDEFINED);
  const limit = 10;

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setPage(1);
  };

  const { data, isLoading, error, refetch, isRefetching } = useGetMasterReviews(
    {
      page,
      limit,
      status: status || undefined,
    }
  );

  return (
    <ThemedView style={styles.container}>
      <StatusFilter
        selectedStatus={status}
        onStatusChange={handleStatusChange}
      />

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ThemedText>Loading reviews...</ThemedText>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <ThemedText>Error loading reviews</ThemedText>
          <ThemedText style={styles.errorMessage}>
            {error instanceof Error ? error.message : "Unknown error"}
          </ThemedText>
        </View>
      ) : !data || !data.data.reviews.length ? (
        <View style={styles.centerContainer}>
          <ThemedText>No reviews found</ThemedText>
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.scrollView}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
            }
          >
            {data.data.reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </ScrollView>
          <Pagination
            totalcount={data.data.pagination.total}
            limit={data.data.pagination.limit}
            currentPage={page}
            onPageChange={setPage}
          />
        </>
      )}
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
