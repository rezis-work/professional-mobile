import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Pressable, View, StyleSheet } from "react-native";
import { LeadStatus } from "../../types";
import { useTranslation } from "react-i18next";

interface StatusFilterProps {
  selectedStatus: LeadStatus;
  onStatusChange: (status: LeadStatus) => void;
}

export function StatusFilter({
  selectedStatus,
  onStatusChange,
}: StatusFilterProps) {
  const { t } = useTranslation();

  const statuses = [
    { value: LeadStatus.UNDEFINED, label: t("leads.all") },
    { value: LeadStatus.PENDING, label: t("common.pending") },
    { value: LeadStatus.ACCEPTED, label: t("profile.accepted") },
    { value: LeadStatus.COMPLETED, label: t("common.completed") },
    { value: LeadStatus.DECLINED, label: t("profile.declined") },
    { value: LeadStatus.CANCELLED, label: t("leads.cancelled") },
  ];

  return (
    <View style={styles.container}>
      {statuses.map((status) => (
        <ThemedView
          key={status.value}
          style={[
            styles.chip,
            selectedStatus === status.value && styles.chipSelected,
          ]}
        >
          <Pressable onPress={() => onStatusChange(status.value)}>
            <ThemedText
              style={[
                styles.chipText,
                selectedStatus === status.value && styles.chipTextSelected,
              ]}
            >
              {status.label}
            </ThemedText>
          </Pressable>
        </ThemedView>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  chipSelected: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  chipText: {
    fontSize: 14,
    color: "#64748b",
  },
  chipTextSelected: {
    color: "white",
    fontWeight: "600",
  },
});
