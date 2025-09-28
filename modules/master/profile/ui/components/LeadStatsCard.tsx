import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

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
  return (
    <ThemedView style={{ borderRadius: 12, padding: 16, gap: 8 }}>
      <ThemedText type="subtitle">Lead Stats</ThemedText>
      <ThemedText>Total: {totalLeads}</ThemedText>
      <ThemedText>Pending: {pendingLeads}</ThemedText>
      <ThemedText>Accepted: {acceptedLeads}</ThemedText>
      <ThemedText>Declined: {declinedLeads}</ThemedText>
      <ThemedText>Avg Job Value: {averageJobValue}</ThemedText>
      <ThemedText>Total Revenue: {totalRevenue ?? 0}</ThemedText>
    </ThemedView>
  );
}
