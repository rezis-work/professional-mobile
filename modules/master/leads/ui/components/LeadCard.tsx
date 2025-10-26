import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Pressable, View, StyleSheet } from "react-native";
import type { Lead } from "../../types";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

interface LeadCardProps {
  lead: Lead;
}

export function LeadCard({ lead }: LeadCardProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#f59e0b";
      case "accepted":
        return "#3b82f6";
      case "completed":
        return "#10b981";
      case "declined":
        return "#ef4444";
      case "cancelled":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <Pressable
      onPress={() => router.push(`/(master)/leads/${lead.id}`)}
      style={styles.card}
    >
      <ThemedView style={styles.cardContent}>
        <View style={styles.header}>
          <ThemedText type="subtitle" style={styles.clientName}>
            {lead.client.fullName}
          </ThemedText>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(lead.status) },
            ]}
          >
            <ThemedText style={styles.statusText}>
              {lead.status.toUpperCase()}
            </ThemedText>
          </View>
        </View>

        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>{t("leads.job")}:</ThemedText>
          <ThemedText style={styles.value}>{lead.jobTitle.en}</ThemedText>
        </View>

        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>{t("leads.location")}:</ThemedText>
          <ThemedText style={styles.value}>{lead.location}</ThemedText>
        </View>

        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>
            {t("leads.requestedTime")}:
          </ThemedText>
          <ThemedText style={styles.value}>
            {formatDate(lead.requestedTime)}
          </ThemedText>
        </View>

        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>{t("leads.price")}:</ThemedText>
          <ThemedText style={styles.priceValue}>
            {lead.price ? `${lead.price} ₾` : t("leads.notSet")}
          </ThemedText>
        </View>

        {lead.message && (
          <View style={styles.messageContainer}>
            <ThemedText style={styles.label}>{t("leads.message")}:</ThemedText>
            <ThemedText style={styles.messageText} numberOfLines={2}>
              {lead.message}
            </ThemedText>
          </View>
        )}
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  clientName: {
    fontSize: 18,
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    opacity: 0.7,
    flex: 1,
  },
  value: {
    fontSize: 14,
    flex: 2,
    textAlign: "right",
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#10b981",
    flex: 2,
    textAlign: "right",
  },
  messageContainer: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  messageText: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.8,
  },
});
