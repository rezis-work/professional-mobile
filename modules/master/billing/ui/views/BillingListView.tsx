import { useState } from "react";
import { ScrollView, View, StyleSheet, RefreshControl } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BillingCard } from "../components/BillingCard";
import { UploadProofModal } from "../components/UploadProofModal";
import { Pagination } from "@/components/Pagination";
import { useGetMasterBillings } from "../../hooks/use-get-master-billings";

export function BillingListView() {
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
    <ThemedView style={styles.container}>
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ThemedText>Loading billing...</ThemedText>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <ThemedText>Error loading billing</ThemedText>
          <ThemedText style={styles.errorMessage}>
            {error instanceof Error ? error.message : "Unknown error"}
          </ThemedText>
        </View>
      ) : !data || !data.data.length ? (
        <View style={styles.centerContainer}>
          <ThemedText>No billing found</ThemedText>
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.scrollView}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
            }
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
