import { Pagination } from "@/components/Pagination";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetNotifications } from "../../hooks/use-get-notifications";
import { NotificationCard } from "../components/NotificationCard";

export function NotificationsListView() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error, refetch, isRefetching } = useGetNotifications(
    page,
    limit
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScreenHeader title={t("masterNavigation.notifications")} />
      <View className="flex-1">
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#2563eb" />
            <Text className="text-base font-medium text-gray-600 dark:text-gray-400 mt-6">
              Loading notifications...
            </Text>
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center px-6">
            <View
              className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 border-2 border-red-200 dark:border-red-800"
              style={{
                shadowColor: "#ef4444",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <View className="flex-row items-center mb-3">
                <View className="bg-red-100 dark:bg-red-900/40 rounded-full p-2 mr-3">
                  <Ionicons name="alert-circle" size={24} color="#ef4444" />
                </View>
                <Text className="text-lg font-bold text-red-600 dark:text-red-400">
                  Error loading notifications
                </Text>
              </View>
              <Text className="text-sm font-medium text-red-600 dark:text-red-400 ml-11">
                {error instanceof Error ? error.message : "Unknown error"}
              </Text>
            </View>
          </View>
        ) : !data || !data.notifications.length ? (
          <View className="flex-1 items-center justify-center py-16">
            <View className="bg-gray-100 dark:bg-neutral-800 rounded-full p-6 mb-4">
              <Ionicons
                name="notifications-outline"
                size={56}
                color="#9ca3af"
              />
            </View>
            <Text className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              No notifications found
            </Text>
          </View>
        ) : (
          <>
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ padding: 24, paddingTop: 16 }}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
              }
            >
              {data.notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </ScrollView>
            <Pagination
              totalcount={data.pagination.total}
              limit={Number(data.pagination.limit)}
              currentPage={page}
              onPageChange={setPage}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
