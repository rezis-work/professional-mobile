import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { ThemedText } from "@/components/themed-text";
import type { MasterBillingItem } from "../../types";
import { useTranslation } from "react-i18next";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";

interface BillingCardProps {
  billing: MasterBillingItem;
  onUploadProof: () => void;
}

export function BillingCard({ billing, onUploadProof }: BillingCardProps) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const cardBg = useThemeColor(
    { light: "#FFFFFF", dark: "#1F2937" },
    "background"
  );
  const borderColor = useThemeColor(
    { light: "#E5E7EB", dark: "#374151" },
    "text"
  );
  const tint = useThemeColor(
    { light: "#3B82F6", dark: "#2563EB" },
    "tint"
  );

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
    <View
      style={[
        styles.container,
        { backgroundColor: cardBg, borderColor },
        isDark && styles.cardDark,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.titleRow}>
            <Ionicons name="receipt" size={20} color={tint} />
            <ThemedText style={styles.title}>
              {t("billing.billing")} #{billing.id.slice(0, 8)}
            </ThemedText>
          </View>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={12} color="#6B7280" />
            <ThemedText style={styles.createdDate}>
              {t("billing.created")}: {formatDate(billing.createdAt)}
            </ThemedText>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(billing.status) },
          ]}
        >
          <ThemedText style={styles.statusText} lightColor="#FFFFFF" darkColor="#FFFFFF">
            {billing.status}
          </ThemedText>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statItem, { backgroundColor: isDark ? "#111827" : "#F3F4F6" }]}>
          <View style={styles.statHeader}>
            <Ionicons name="briefcase" size={16} color="#6B7280" />
            <ThemedText style={styles.statLabel}>
              {t("billing.totalJobs")}
            </ThemedText>
          </View>
          <ThemedText style={styles.statValue}>{billing.totalJobs}</ThemedText>
        </View>
        <View style={[styles.statItem, { backgroundColor: isDark ? "#111827" : "#F3F4F6" }]}>
          <View style={styles.statHeader}>
            <Ionicons name="cash" size={16} color="#10B981" />
            <ThemedText style={styles.statLabel}>
              {t("billing.totalAmount")}
            </ThemedText>
          </View>
          <ThemedText style={[styles.statValue, { color: "#10B981" }]}>
            {billing.totalAmount}₾
          </ThemedText>
        </View>
        <View style={[styles.statItem, { backgroundColor: isDark ? "#111827" : "#F3F4F6" }]}>
          <View style={styles.statHeader}>
            <Ionicons name="card" size={16} color="#F59E0B" />
            <ThemedText style={styles.statLabel}>
              {t("billing.adminFee")}
            </ThemedText>
          </View>
          <ThemedText style={[styles.statValue, { color: "#F59E0B" }]}>
            {billing.adminFee}₾
          </ThemedText>
        </View>
      </View>

      <View style={[styles.dateInfo, { backgroundColor: isDark ? "#111827" : "#F3F4F6" }]}>
        <View style={styles.dateRow}>
          <Ionicons name="calendar" size={14} color="#6B7280" />
          <ThemedText style={styles.dateText}>
            {t("billing.week")}: {formatDate(billing.weekStart)} -{" "}
            {formatDate(billing.weekEnd)}
          </ThemedText>
        </View>
        <View style={styles.dateRow}>
          <Ionicons name="time" size={14} color="#6B7280" />
          <ThemedText style={styles.dateText}>
            {t("billing.dueDate")}: {formatDate(billing.dueDate)}
          </ThemedText>
        </View>
      </View>

      {billing.adminNote && (
        <View style={[styles.noteSection, { backgroundColor: isDark ? "#111827" : "#F9FAFB" }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text" size={16} color="#6B7280" />
            <ThemedText style={styles.noteLabel}>
              {t("billing.adminNote")}:
            </ThemedText>
          </View>
          <ThemedText style={styles.noteText}>{billing.adminNote}</ThemedText>
        </View>
      )}

      <View style={styles.reminderSection}>
        <Ionicons name="notifications" size={14} color="#6B7280" />
        <ThemedText style={styles.reminderText}>
          {t("billing.remindersSent")}: {billing.remindersSent}
        </ThemedText>
      </View>

      <TouchableOpacity
        style={[styles.uploadButton, { backgroundColor: tint }]}
        onPress={onUploadProof}
        activeOpacity={0.7}
      >
        <Ionicons name="cloud-upload-outline" size={18} color="#FFFFFF" />
        <ThemedText style={styles.uploadButtonText} lightColor="#FFFFFF" darkColor="#FFFFFF">
          {t("billing.uploadProof")}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardDark: {
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
    gap: 6,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 0,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  createdDate: {
    fontSize: 12,
    opacity: 0.6,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 0,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  dateInfo: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  dateText: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 0,
  },
  noteSection: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  noteLabel: {
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.7,
    marginBottom: 0,
  },
  noteText: {
    fontSize: 14,
    opacity: 0.8,
  },
  reminderSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.05)",
    marginBottom: 16,
  },
  reminderText: {
    fontSize: 12,
    opacity: 0.7,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  uploadButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
