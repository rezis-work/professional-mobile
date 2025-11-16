import { useState } from "react";
import { ScrollView, View, RefreshControl, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ReviewCard } from "../components/ReviewCard";
import { StatusFilter } from "../components/StatusFilter";
import { Pagination } from "@/components/Pagination";
import { useGetMasterReviews } from "../../hooks/use-get-master-reviews";
import { ReviewStatus } from "../../types";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

export function ReviewsListView() {
  const { t } = useTranslation();
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
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScreenHeader title={t("masterNavigation.reviews")} />
      
      <View className="flex-1">
        <View className="px-6 pt-4 pb-2">
          <StatusFilter
            selectedStatus={status}
            onStatusChange={handleStatusChange}
          />
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#2563eb" />
            <Text className="text-base font-medium text-gray-600 dark:text-gray-400 mt-6">
              {t("reviews.loadingReviews")}
            </Text>
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center px-6">
            <View className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 border-2 border-red-200 dark:border-red-800">
              <View className="flex-row items-center mb-3">
                <View className="bg-red-100 dark:bg-red-900/40 rounded-full p-2 mr-3">
                  <Ionicons name="alert-circle" size={24} color="#ef4444" />
                </View>
                <Text className="text-lg font-bold text-red-600 dark:text-red-400">
                  {t("reviews.errorLoadingReviews")}
                </Text>
              </View>
              <Text className="text-sm font-medium text-red-600 dark:text-red-400 ml-11">
                {error instanceof Error ? error.message : "Unknown error"}
              </Text>
            </View>
          </View>
        ) : !data || !data.data.reviews.length ? (
          <View className="flex-1 items-center justify-center py-16">
            <View className="bg-gray-100 dark:bg-neutral-800 rounded-full p-6 mb-4">
              <Ionicons name="star-outline" size={56} color="#9ca3af" />
            </View>
            <Text className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              {t("reviews.noReviewsFound")}
            </Text>
          </View>
        ) : (
          <>
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ padding: 24, paddingTop: 16 }}
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
    </SafeAreaView>
  );
}
