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
import { useGetLeadsList } from "../../hooks/use-get-leads-list";
import { LeadStatus } from "../../types";
import { LeadCard } from "../components/LeadCard";
import { StatusFilter } from "../components/StatusFilter";

export function LeadsListView() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<LeadStatus>(LeadStatus.UNDEFINED);
  const limit = 4;

  const handleStatusChange = (newStatus: LeadStatus) => {
    setStatus(newStatus);
    setPage(1); // Reset to first page when filter changes
  };

  const { data, isLoading, error, refetch, isRefetching } = useGetLeadsList({
    page,
    limit,
    status,
  });

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScreenHeader title={t("masterNavigation.leads")} />

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
              {t("leads.loadingLeads")}
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
                  {t("leads.errorLoadingLeads")}
                </Text>
              </View>
              <Text className="text-sm font-medium text-red-600 dark:text-red-400 ml-11">
                {error.message}
              </Text>
            </View>
          </View>
        ) : !data || !data.data.leads.length ? (
          <View className="flex-1 items-center justify-center py-16">
            <View className="bg-gray-100 dark:bg-neutral-800 rounded-full p-6 mb-4">
              <Ionicons name="document-outline" size={56} color="#9ca3af" />
            </View>
            <Text className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              {t("common.noData")}
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
              {data.data.leads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
            </ScrollView>
            <Pagination
              totalcount={data.data.pagination.total}
              limit={limit}
              currentPage={page}
              onPageChange={setPage}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
