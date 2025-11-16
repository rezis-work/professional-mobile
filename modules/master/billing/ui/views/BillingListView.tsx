import { useState } from "react";
import { ScrollView, View, RefreshControl, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/ScreenHeader";
import { BillingCard } from "../components/BillingCard";
import { UploadProofModal } from "../components/UploadProofModal";
import { Pagination } from "@/components/Pagination";
import { useGetMasterBillings } from "../../hooks/use-get-master-billings";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

export function BillingListView() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBillingId, setSelectedBillingId] = useState("");
  const limit = 10;

  const { data, isLoading, error, refetch, isRefetching } =
    useGetMasterBillings({
      page,
      limit,
    });

  const handleUploadProof = (billingId: string) => {
    setSelectedBillingId(billingId);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedBillingId("");
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScreenHeader title={t("masterNavigation.billing")} />
      
      <View className="flex-1">
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#2563eb" />
            <Text className="text-base font-medium text-gray-600 dark:text-gray-400 mt-6">
              {t("billing.loadingBilling")}
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
                  {t("billing.errorLoadingBilling")}
                </Text>
              </View>
              <Text className="text-sm font-medium text-red-600 dark:text-red-400 ml-11">
                {error instanceof Error ? error.message : "Unknown error"}
              </Text>
            </View>
          </View>
        ) : !data || !data.data.length ? (
          <View className="flex-1 items-center justify-center py-16">
            <View className="bg-gray-100 dark:bg-neutral-800 rounded-full p-6 mb-4">
              <Ionicons name="card-outline" size={56} color="#9ca3af" />
            </View>
            <Text className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              {t("billing.noBillingFound")}
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
              {data.data.map((billing) => (
                <BillingCard
                  key={billing.id}
                  billing={billing}
                  onUploadProof={() => handleUploadProof(billing.id)}
                />
              ))}
            </ScrollView>
            <Pagination
              totalcount={data.pagination.total}
              limit={data.pagination.limit}
              currentPage={page}
              onPageChange={setPage}
            />
          </>
        )}
      </View>

      <UploadProofModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        billingId={selectedBillingId}
      />
    </SafeAreaView>
  );
}
