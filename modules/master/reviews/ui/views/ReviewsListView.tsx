import { useState } from "react";
import { ScrollView, View, StyleSheet, RefreshControl, ActivityIndicator } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ReviewCard } from "../components/ReviewCard";
import { StatusFilter } from "../components/StatusFilter";
import { Pagination } from "@/components/Pagination";
import { useGetMasterReviews } from "../../hooks/use-get-master-reviews";
import { ReviewStatus } from "../../types";
import { useTranslation } from "react-i18next";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";

export function ReviewsListView() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>(ReviewStatus.UNDEFINED);
  const limit = 10;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const backgroundColor = useThemeColor(
    { light: "#F3F4F6", dark: "#000000" },
    "background"
  );

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
    <View style={[styles.container, { backgroundColor }]}>
      <StatusFilter
        selectedStatus={status}
        onStatusChange={handleStatusChange}
      />

      {isLoading ? (
        <View style={[styles.centerContainer, { backgroundColor }]}>
          <ActivityIndicator size="large" color={isDark ? "#3B82F6" : "#2563EB"} />
          <ThemedText style={styles.loadingText}>{t("reviews.loadingReviews")}</ThemedText>
        </View>
      ) : error ? (
        <View style={[styles.centerContainer, { backgroundColor }]}>
          <Ionicons name="alert-circle" size={48} color="#EF4444" />
          <ThemedText style={styles.errorTitle}>{t("reviews.errorLoadingReviews")}</ThemedText>
          <ThemedText style={styles.errorMessage}>
            {error instanceof Error ? error.message : "Unknown error"}
          </ThemedText>
        </View>
      ) : !data || !data.data.reviews.length ? (
        <View style={[styles.centerContainer, { backgroundColor }]}>
          <Ionicons name="star-outline" size={48} color={isDark ? "#6B7280" : "#9CA3AF"} />
          <ThemedText style={styles.emptyText}>{t("reviews.noReviewsFound")}</ThemedText>
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
            }
            showsVerticalScrollIndicator={false}
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
