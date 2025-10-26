import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ReviewStatus } from "../../types";
import { useTranslation } from "react-i18next";

interface StatusFilterProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

export function StatusFilter({
  selectedStatus,
  onStatusChange,
}: StatusFilterProps) {
  const { t } = useTranslation();

  const statuses = [
    { label: t("reviews.all"), value: ReviewStatus.UNDEFINED },
    { label: t("common.pending"), value: ReviewStatus.PENDING },
    { label: t("common.approved"), value: ReviewStatus.APPROVED },
    { label: t("common.rejected"), value: ReviewStatus.REJECTED },
  ];

  return (
    <View style={styles.container}>
      {statuses.map((status) => (
        <TouchableOpacity
          key={status.value}
          style={[
            styles.chip,
            selectedStatus === status.value && styles.chipActive,
          ]}
          onPress={() => onStatusChange(status.value)}
          activeOpacity={0.7}
        >
          <ThemedText
            style={[
              styles.chipText,
              selectedStatus === status.value && styles.chipTextActive,
            ]}
          >
            {status.label}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  chipActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#fff",
  },
});
