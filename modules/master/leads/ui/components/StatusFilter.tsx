import { View, StyleSheet, Pressable } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { LeadStatus } from "../../types";

interface StatusFilterProps {
  selectedStatus: LeadStatus;
  onStatusChange: (status: LeadStatus) => void;
}

const statuses = [
  { value: LeadStatus.UNDEFINED, label: "All" },
  { value: LeadStatus.PENDING, label: "Pending" },
  { value: LeadStatus.ACCEPTED, label: "Accepted" },
  { value: LeadStatus.COMPLETED, label: "Completed" },
  { value: LeadStatus.DECLINED, label: "Declined" },
  { value: LeadStatus.CANCELLED, label: "Cancelled" },
];

export function StatusFilter({
  selectedStatus,
  onStatusChange,
}: StatusFilterProps) {
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
