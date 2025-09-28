import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";

export default function ReviewsScreen() {
  return (
    <ThemedView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <ThemedText type="title">Reviews</ThemedText>
    </ThemedView>
  );
}
