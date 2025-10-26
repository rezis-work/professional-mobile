import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTranslation } from "react-i18next";

export function LeadStatsCard({
  totalLeads,
  pendingLeads,
  acceptedLeads,
  declinedLeads,
  averageJobValue,
  totalRevenue,
}: {
  totalLeads: number;
  pendingLeads: number | string;
  acceptedLeads: number | string;
  declinedLeads: number | string;
  averageJobValue: number;
  totalRevenue: number | null;
}) {
  const { t } = useTranslation();

  return (
    <ThemedView style={{ borderRadius: 12, padding: 16, gap: 8 }}>
      <ThemedText type="subtitle">{t("profile.leadStats")}</ThemedText>
      <ThemedText>{t("profile.total")}: {totalLeads}</ThemedText>
      <ThemedText>{t("common.pending")}: {pendingLeads}</ThemedText>
      <ThemedText>{t("profile.accepted")}: {acceptedLeads}</ThemedText>
      <ThemedText>{t("profile.declined")}: {declinedLeads}</ThemedText>
      <ThemedText>{t("profile.avgJobValue")}: {averageJobValue}</ThemedText>
      <ThemedText>{t("profile.totalRevenue")}: {totalRevenue ?? 0}</ThemedText>
    </ThemedView>
  );
}
