import { ThemedText } from "@/components/themed-text";
import { Pressable, View } from "react-native";
import type { UnlockedCity } from "../../types";

export function UnlockedCard({
  city,
  isPending,
  onRemove,
  unlockedDate,
}: {
  city: UnlockedCity;
  isPending: boolean;
  onRemove: (cityPartId: string) => void;
  unlockedDate: string;
}) {
  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: city.isActive ? "#86efac" : "#e2e8f0",
        padding: 16,
        gap: 8,
      }}
    >
      <View style={{ gap: 2 }}>
        <ThemedText type="subtitle">{city.cityName}</ThemedText>
        <ThemedText>{city.cityPartName}</ThemedText>
      </View>
      <View style={{ gap: 4 }}>
        <ThemedText>Unlock cost: {city.unlockCost} points</ThemedText>
        <ThemedText>Unlocked: {unlockedDate}</ThemedText>
        <ThemedText>Status: {city.isActive ? "Active" : "Inactive"}</ThemedText>
      </View>
      <Pressable
        onPress={() => onRemove(city.cityPartId)}
        disabled={isPending}
        style={{
          alignSelf: "flex-start",
          backgroundColor: "#ef4444",
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 8,
          opacity: isPending ? 0.6 : 1,
        }}
      >
        <ThemedText style={{ color: "white" }}>
          {isPending ? "Removing..." : "Remove"}
        </ThemedText>
      </Pressable>
    </View>
  );
}
