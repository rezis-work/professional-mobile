import { ThemedText } from "@/components/themed-text";
import { Pressable, View } from "react-native";
import type { Job } from "../../types";

export function JobsGrid({
  jobs,
  onSelect,
}: {
  jobs: Job[];
  onSelect: (job: Job) => void;
}) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
      {jobs.map((job) => (
        <Pressable
          key={job.id}
          onPress={() => onSelect(job)}
          style={{
            width: "48%",
            backgroundColor: "white",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#e2e8f0",
            padding: 12,
          }}
        >
          <ThemedText type="subtitle">{job.title.en}</ThemedText>
          <ThemedText style={{ marginTop: 4 }} numberOfLines={2}>
            {job.description.en}
          </ThemedText>
          <ThemedText style={{ marginTop: 6, color: "#64748b" }}>
            {new Date(job.createdAt).toLocaleDateString()} • {job.masterCount}{" "}
            masters
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
}
