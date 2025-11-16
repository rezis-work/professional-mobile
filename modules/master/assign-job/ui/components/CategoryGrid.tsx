import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import type { Category } from "../../types";

export function CategoryGrid({
  categories,
  onSelect,
}: {
  categories: Category[];
  onSelect: (category: Category) => void;
}) {
  return (
    <View className="flex-row flex-wrap gap-4">
      {categories.map((category) => (
        <Pressable
          key={category.id}
          onPress={() => onSelect(category)}
          className="w-[48%] bg-white dark:bg-neutral-800 rounded-2xl border border-gray-200 dark:border-neutral-700 p-5 shadow-md active:opacity-80 active:scale-95"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View className="bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/40 dark:to-purple-800/20 rounded-xl p-3 mb-4 self-start">
            <Ionicons name="grid" size={22} color="#9333ea" />
          </View>
          <Text className="text-lg font-bold text-text mb-2" numberOfLines={1}>
            {category.name.en}
          </Text>
          <Text
            className="text-sm text-gray-600 dark:text-gray-400 mb-1.5"
            numberOfLines={1}
          >
            {category.name.ka}
          </Text>
          <Text
            className="text-sm text-gray-600 dark:text-gray-400 mb-4"
            numberOfLines={1}
          >
            {category.name.ru}
          </Text>
          {typeof category.jobCount === "number" ? (
            <View className="flex-row items-center justify-between pt-3 border-t border-gray-100 dark:border-neutral-700">
              <View className="flex-row items-center bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1.5 rounded-lg">
                <Ionicons name="briefcase-outline" size={14} color="#2563eb" />
                <Text className="text-xs font-semibold text-blue-600 dark:text-blue-400 ml-1.5">
                  {category.jobCount} {category.jobCount === 1 ? "job" : "jobs"}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
            </View>
          ) : null}
        </Pressable>
      ))}
    </View>
  );
}
