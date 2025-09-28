import { ThemedText } from "@/components/themed-text";
import { Pressable, View } from "react-native";
import type { CityPart } from "../../types";

export function CityPartsGrid({
  parts,
  onUnlock,
  unlockingPartId,
}: {
  parts: CityPart[];
  onUnlock: (part: CityPart) => void;
  unlockingPartId: string | null;
}) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
      {parts.map((part) => (
        <View
          key={part.id}
          style={{
            width: "48%",
            backgroundColor: "white",
            borderRadius: 12,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "#e2e8f0",
            padding: 12,
            gap: 8,
          }}
        >
          <ThemedText type="subtitle">{part.name}</ThemedText>
          <ThemedText>{part.unlockCost} points required</ThemedText>
          <Pressable
            onPress={() => onUnlock(part)}
            disabled={unlockingPartId === part.id}
            style={{
              backgroundColor: "#2563eb",
              paddingVertical: 10,
              borderRadius: 8,
              alignItems: "center",
              opacity: unlockingPartId === part.id ? 0.6 : 1,
            }}
          >
            <ThemedText style={{ color: "white" }}>
              {unlockingPartId === part.id
                ? "Unlocking..."
                : `Unlock (${part.unlockCost} pts)`}
            </ThemedText>
          </Pressable>
        </View>
      ))}
    </View>
  );
}
