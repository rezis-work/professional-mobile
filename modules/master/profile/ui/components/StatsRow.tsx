import { ThemedText } from "@/components/themed-text";
import { View } from "react-native";

export function StatsRow({
  completedJobs,
  averageRating,
  points,
}: {
  completedJobs: number;
  averageRating: number;
  points: number;
}) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
      <View style={{ alignItems: "center" }}>
        <ThemedText>Completed</ThemedText>
        <ThemedText type="title">{completedJobs}</ThemedText>
      </View>
      <View style={{ alignItems: "center" }}>
        <ThemedText>Avg Rating</ThemedText>
        <ThemedText type="title">{averageRating}</ThemedText>
      </View>
      <View style={{ alignItems: "center" }}>
        <ThemedText>Points</ThemedText>
        <ThemedText type="title">{points}</ThemedText>
      </View>
    </View>
  );
}
