import { ThemedText } from "@/components/themed-text";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

export function StatsRow({
  completedJobs,
  averageRating,
  points,
}: {
  completedJobs: number;
  averageRating: number;
  points: number;
}) {
  const { t } = useTranslation();

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
      <View style={{ alignItems: "center" }}>
        <ThemedText>{t("profile.completed")}</ThemedText>
        <ThemedText type="title">{completedJobs}</ThemedText>
      </View>
      <View style={{ alignItems: "center" }}>
        <ThemedText>{t("profile.avgRating")}</ThemedText>
        <ThemedText type="title">{averageRating}</ThemedText>
      </View>
      <View style={{ alignItems: "center" }}>
        <ThemedText>{t("profile.points")}</ThemedText>
        <ThemedText type="title">{points}</ThemedText>
      </View>
    </View>
  );
}
