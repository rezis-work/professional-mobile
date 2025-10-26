import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTranslation } from "react-i18next";

export function BioCard({ bio }: { bio: string | null }) {
  const { t } = useTranslation();

  return (
    <ThemedView style={{ borderRadius: 12, padding: 16, gap: 8 }}>
      <ThemedText type="subtitle">{t("profile.bio")}</ThemedText>
      <ThemedText>{bio || "-"}</ThemedText>
    </ThemedView>
  );
}
