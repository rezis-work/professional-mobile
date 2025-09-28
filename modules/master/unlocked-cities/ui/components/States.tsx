import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { ActivityIndicator } from "react-native";

export function UnlockedSkeleton() {
  return (
    <ThemedView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <ActivityIndicator />
    </ThemedView>
  );
}

export function UnlockedError({ message }: { message?: string }) {
  return (
    <ThemedView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <ThemedText>
        {message || "Failed to load your unlocked cities."}
      </ThemedText>
    </ThemedView>
  );
}

export function UnlockedNoData() {
  return (
    <ThemedView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <ThemedText>No Unlocked Cities</ThemedText>
    </ThemedView>
  );
}
