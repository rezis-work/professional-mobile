import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
    <View className="flex-row flex-wrap gap-4">
      {parts.map((part) => (
        <View
          key={part.id}
          className="w-[48%] bg-white dark:bg-neutral-800 rounded-3xl border border-gray-200 dark:border-neutral-700 overflow-hidden"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 5,
          }}
        >
          {/* Header */}
          <View className="bg-blue-500 dark:bg-blue-600 px-4 py-3">
            <Text className="text-lg font-extrabold text-white" numberOfLines={2}>
              {part.name}
            </Text>
          </View>

          {/* Content */}
          <View className="p-4">
            <View className="flex-row items-center mb-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl px-3 py-2.5">
              <View className="bg-amber-100 dark:bg-amber-900/40 rounded-full p-1.5 mr-2">
                <Ionicons name="trophy" size={16} color="#f59e0b" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-medium text-amber-700 dark:text-amber-300 uppercase tracking-wide">
                  Required
                </Text>
                <Text className="text-base font-bold text-amber-900 dark:text-amber-100">
                  {part.unlockCost} points
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => onUnlock(part)}
              disabled={unlockingPartId === part.id}
              className={`bg-blue-600 dark:bg-blue-700 py-3.5 rounded-xl items-center flex-row justify-center ${
                unlockingPartId === part.id ? "opacity-60" : "active:opacity-80"
              }`}
              style={{
                shadowColor: "#2563eb",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              {unlockingPartId === part.id ? (
                <>
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-white font-bold ml-2">
                    Unlocking...
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons name="lock-open" size={20} color="white" />
                  <Text className="text-white font-bold ml-2">
                    Unlock
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );
}
