import { ThemedText } from "@/components/themed-text";
import { TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

export type Availability = "now" | "tomorrow" | "next_week" | "on_holiday";

export function AvailabilityButtons({
  value,
  onSelect,
}: {
  value: Availability;
  onSelect: (value: Availability) => void;
}) {
  const { t } = useTranslation();
  const keys: Availability[] = ["now", "tomorrow", "next_week", "on_holiday"];

  const getLabel = (key: string) => {
    const labelMap: Record<string, string> = {
      now: t("settings.availabilityNow"),
      tomorrow: t("settings.availabilityTomorrow"),
      next_week: t("settings.availabilityNextWeek"),
      on_holiday: t("settings.availabilityOnHoliday"),
    };
    return labelMap[key] || key;
  };

  return (
    <>
      <ThemedText type="subtitle">{t("settings.availability")}</ThemedText>
      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        {keys.map((key) => (
          <TouchableOpacity
            key={key}
            onPress={() => onSelect(key)}
            style={{
              backgroundColor: value === key ? "#2D5BE3" : "#f1f5f9",
              paddingVertical: 10,
              paddingHorizontal: 12,
              borderRadius: 8,
            }}
          >
            <ThemedText style={{ color: value === key ? "white" : undefined }}>
              {getLabel(key)}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}
