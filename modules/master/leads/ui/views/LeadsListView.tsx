import { useState } from "react";
import { ScrollView, View, StyleSheet, RefreshControl } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { LeadCard } from "../components/LeadCard";
import { StatusFilter } from "../components/StatusFilter";
import { useGetLeadsList } from "../../hooks/use-get-leads-list";
import { LeadStatus } from "../../types";
import { Pagination } from "@/components/Pagination";
import { useTranslation } from "react-i18next";

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
    <ThemedView style={styles.container}>
      <StatusFilter
        selectedStatus={status}
        onStatusChange={handleStatusChange}
      />

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ThemedText>{t("leads.loadingLeads")}</ThemedText>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <ThemedText>{t("leads.errorLoadingLeads")}</ThemedText>
          <ThemedText>{error.message}</ThemedText>
        </View>
      ) : !data || !data.data.leads.length ? (
        <View style={styles.centerContainer}>
          <ThemedText>{t("common.noData")}</ThemedText>
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.scrollView}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
            }
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
  },
});
