import { ThemedText } from "@/components/themed-text";
import { TouchableOpacity, View } from "react-native";

export type Availability = "now" | "tomorrow" | "next_week" | "on_holiday";

export function AvailabilityButtons({
  value,
  onSelect,
}: {
  value: Availability;
  onSelect: (value: Availability) => void;
}) {
  const keys: Availability[] = ["now", "tomorrow", "next_week", "on_holiday"];
  return (
    <>
      <ThemedText type="subtitle">Availability</ThemedText>
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
              {key}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}
