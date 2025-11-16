import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
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
      className="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-200 dark:border-neutral-700 overflow-hidden"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        flex: 1,
      }}
    >
      <View className="p-4 flex-1 justify-between">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1 mr-3">
            <Text
              className={`text-lg font-bold text-text mb-1 ${
                city.isActive ? "" : "opacity-60"
              }`}
              numberOfLines={1}
            >
              {city.cityName}
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              {city.cityPartName}
            </Text>
          </View>
          <View
            className={`rounded-full px-2.5 py-1 ${
              city.isActive
                ? "bg-blue-100 dark:bg-blue-900/30"
                : "bg-gray-100 dark:bg-neutral-700"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                city.isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {city.isActive ? "Active" : "Inactive"}
            </Text>
          </View>
        </View>

        {/* Info */}
        <View className="flex-row items-center justify-between mb-3 pb-3 border-b border-gray-100 dark:border-neutral-700">
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={14} color="#9ca3af" />
            <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1.5">
              {unlockedDate}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="trophy-outline" size={14} color="#f59e0b" />
            <Text className="text-xs font-semibold text-gray-600 dark:text-gray-400 ml-1.5">
              {city.unlockCost} pts
            </Text>
          </View>
        </View>

        {/* Remove Button */}
        <Pressable
          onPress={() => onRemove(city.cityPartId)}
          disabled={isPending}
          className={`flex-row items-center justify-center py-2.5 rounded-xl border ${
            isPending
              ? "opacity-50 border-gray-300 dark:border-neutral-600"
              : "border-red-200 dark:border-red-800 active:opacity-70"
          }`}
        >
          <Ionicons
            name="trash-outline"
            size={16}
            color={isPending ? "#9ca3af" : "#ef4444"}
          />
          <Text
            className={`text-sm font-semibold ml-2 ${
              isPending
                ? "text-gray-400 dark:text-gray-500"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {isPending ? "Removing..." : "Remove"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
