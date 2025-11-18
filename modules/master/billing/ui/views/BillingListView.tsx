import { Pagination } from "@/components/Pagination";
import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useGetMasterBillings } from "../../hooks/use-get-master-billings";
import { BillingCard } from "../components/BillingCard";
import { UploadProofModal } from "../components/UploadProofModal";
import useThemeColorPalette from "@/hooks/use-theme-color-palette";

export function BillingListView() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBillingId, setSelectedBillingId] = useState("");
  const limit = 10;
  const colors = useThemeColorPalette();

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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isLoading ? (
        <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
          <ActivityIndicator
            size="large"
            color={colors.primary}
          />
          <ThemedText style={styles.loadingText}>
            {t("billing.loadingBilling")}
          </ThemedText>
        </View>
      ) : error ? (
        <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
          <Ionicons name="alert-circle" size={48} color="#EF4444" />
          <ThemedText style={styles.errorTitle}>
            {t("billing.errorLoadingBilling")}
          </ThemedText>
          <ThemedText style={styles.errorMessage}>
            {error instanceof Error ? error.message : "Unknown error"}
          </ThemedText>
        </View>
      ) : !data || !data.data.length ? (
        <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
          <Ionicons
            name="receipt-outline"
            size={48}
            color={colors.mutedIcon}
          />
          <ThemedText style={styles.emptyText}>
            {t("billing.noBillingFound")}
          </ThemedText>
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

      <UploadProofModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        billingId={selectedBillingId}
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
