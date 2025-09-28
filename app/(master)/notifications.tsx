import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";

export default function NotificationsScreen() {
  return (
    <ThemedView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <ThemedText type="title">Notifications</ThemedText>
    </ThemedView>
  );
}
