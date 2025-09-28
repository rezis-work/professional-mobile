import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";

export default function BillingScreen() {
  return (
    <ThemedView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <ThemedText type="title">Billing</ThemedText>
    </ThemedView>
  );
}
