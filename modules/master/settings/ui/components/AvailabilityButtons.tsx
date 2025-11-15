import { TouchableOpacity, View, Text } from "react-native"; // 👈 შევცვალე იმპორტები
import { useTranslation } from "react-i18next";
import { Feather } from "@expo/vector-icons"; // 👈 დავამატე იკონკები

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
    // ... (ფუნქციონალი უცვლელია)
    const labelMap: Record<string, string> = {
      now: t("settings.availabilityNow"),
      tomorrow: t("settings.availabilityTomorrow"),
      next_week: t("settings.availabilityNextWeek"),
      on_holiday: t("settings.availabilityOnHoliday"),
    };
    return labelMap[key] || key;
  };

  // 👈 იკონკების სია თანამედროვე დიზაინისთვის
  const iconMap: Record<Availability, keyof typeof Feather.glyphMap> = {
    now: "check-circle",
    tomorrow: "sunrise",
    next_week: "calendar",
    on_holiday: "coffee",
  };

  return (
    // 👈 Fragment-ის მაგივრად ვიყენებთ View-ს gap-ით
    <View className="gap-3">
      {/* 👈 ThemedText -> Text, დავამატე თანამედროვე კლასები */}
      <Text className="text-base font-medium text-text font-sans">
        {t("settings.availability")}
      </Text>
      {/* 👈 style -> className */}
      <View className="flex-row gap-2 flex-wrap">
        {keys.map((key) => (
          <TouchableOpacity
            key={key}
            onPress={() => onSelect(key)}
            // 
            // 👇 ეს არის ახალი "ჩიპის" დიზაინი
            //
            className={`
              flex-row items-center gap-2 py-2.5 px-4 rounded-full border
              ${
                value === key
                  ? "bg-[#2D5BE3] border-[#2D5BE3]" // აქტიური ღილაკი
                  : "bg-input-background border-input-border" // არააქტიური (ერგება თემას)
              }
            `}
          >
            {/* იკონკა */}
            <Feather
              name={iconMap[key]}
              size={16}
              color={value === key ? "white" : "#9ca3af"} // ფერი იცვლება
            />
            {/* ტექსტი */}
            <Text
              className={`
                font-sans font-medium
                ${
                  value === key
                    ? "text-white" // აქტიური ტექსტი
                    : "text-text" // არააქტიური (ერგება თემას)
                }
              `}
            >
              {getLabel(key)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}