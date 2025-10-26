import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import type { MasterBillingItem } from "../../types";
import { useTranslation } from "react-i18next";

interface BillingCardProps {
  billing: MasterBillingItem;
  onUploadProof: () => void;
}

export function BillingCard({ billing, onUploadProof }: BillingCardProps) {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "#10b981";
      case "rejected":
        return "#ef4444";
      case "pending":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <ThemedText style={styles.title}>
            {t("billing.billing")} #{billing.id.slice(0, 8)}
          </ThemedText>
          <ThemedText style={styles.createdDate}>
            {t("billing.created")}: {formatDate(billing.createdAt)}
          </ThemedText>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(billing.status) },
          ]}
        >
          <ThemedText style={styles.statusText}>{billing.status}</ThemedText>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <ThemedText style={styles.statLabel}>
            {t("billing.totalJobs")}
          </ThemedText>
          <ThemedText style={styles.statValue}>{billing.totalJobs}</ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText style={styles.statLabel}>
            {t("billing.totalAmount")}
          </ThemedText>
          <ThemedText style={styles.statValue}>
            {billing.totalAmount}₾
          </ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText style={styles.statLabel}>
            {t("billing.adminFee")}
          </ThemedText>
          <ThemedText style={styles.statValue}>{billing.adminFee}₾</ThemedText>
        </View>
      </View>

      <View style={styles.dateInfo}>
        <ThemedText style={styles.dateText}>
          {t("billing.week")}: {formatDate(billing.weekStart)} -{" "}
          {formatDate(billing.weekEnd)}
        </ThemedText>
        <ThemedText style={styles.dateText}>
          {t("billing.dueDate")}: {formatDate(billing.dueDate)}
        </ThemedText>
      </View>

      {billing.adminNote && (
        <View style={styles.noteSection}>
          <ThemedText style={styles.noteLabel}>
            {t("billing.adminNote")}:
          </ThemedText>
          <ThemedText style={styles.noteText}>{billing.adminNote}</ThemedText>
        </View>
      )}

      <View style={styles.reminderSection}>
        <ThemedText style={styles.reminderText}>
          {t("billing.remindersSent")}: {billing.remindersSent}
        </ThemedText>
      </View>

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={onUploadProof}
        activeOpacity={0.7}
      >
        <ThemedText style={styles.uploadButtonText}>
          {t("billing.uploadProof")}
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  createdDate: {
    fontSize: 12,
    opacity: 0.6,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    padding: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  dateInfo: {
    marginBottom: 12,
  },
  dateText: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  noteSection: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    marginBottom: 12,
  },
  noteLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  noteText: {
    fontSize: 14,
  },
  reminderSection: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    marginBottom: 16,
  },
  reminderText: {
    fontSize: 12,
    opacity: 0.7,
  },
  uploadButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
