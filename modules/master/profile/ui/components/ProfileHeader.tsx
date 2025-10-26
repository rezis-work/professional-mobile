import { ThemedText } from "@/components/themed-text";
import { Image, View } from "react-native";
import { useTranslation } from "react-i18next";

export function ProfileHeader({
  displayName,
  city,
  imageUrl,
  availability,
}: {
  displayName: string;
  city: string | null;
  imageUrl: string | null;
  availability?: string | null;
}) {
  const { t } = useTranslation();

  return (
    <View style={{ alignItems: "center", marginBottom: 12 }}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={{ width: 96, height: 96, borderRadius: 48 }}
        />
      ) : null}
      <ThemedText type="title" style={{ marginTop: 8 }}>
        {displayName}
      </ThemedText>
      <ThemedText>{city || "-"}</ThemedText>
      {availability ? (
        <ThemedText style={{ marginTop: 4 }}>
          {t("profile.available")} {availability}
        </ThemedText>
      ) : null}
    </View>
  );
}
