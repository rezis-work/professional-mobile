import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { ActivityIndicator, View } from "react-native";

export function UnlockSkeleton() {
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

export function UnlockError({ message }: { message?: string }) {
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
        {message || "There was an error loading the cities."}
      </ThemedText>
    </ThemedView>
  );
}

export function UnlockNoData() {
  return (
    <ThemedView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <ThemedText>No cities available.</ThemedText>
    </ThemedView>
  );
}
