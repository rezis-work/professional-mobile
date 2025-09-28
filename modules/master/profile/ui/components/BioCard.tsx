import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export function BioCard({ bio }: { bio: string | null }) {
  return (
    <ThemedView style={{ borderRadius: 12, padding: 16, gap: 8 }}>
      <ThemedText type="subtitle">Bio</ThemedText>
      <ThemedText>{bio || "-"}</ThemedText>
    </ThemedView>
  );
}
