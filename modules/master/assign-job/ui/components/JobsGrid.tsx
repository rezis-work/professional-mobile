import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import type { Job } from "../../types";

export function JobsGrid({
  jobs,
  onSelect,
}: {
  jobs: Job[];
  onSelect: (job: Job) => void;
}) {
  return (
    <View className="flex-row flex-wrap gap-4">
      {jobs.map((job) => (
        <Pressable
          key={job.id}
          onPress={() => onSelect(job)}
          className="w-[48%] bg-white dark:bg-neutral-800 rounded-2xl border border-gray-200 dark:border-neutral-700 p-5 shadow-md active:opacity-80 active:scale-95"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/20 rounded-xl p-3 mb-4 self-start">
            <Ionicons name="briefcase" size={22} color="#2563eb" />
          </View>
          <Text
            className="text-lg font-bold text-text mb-2.5"
            numberOfLines={1}
          >
            {job.title.en}
          </Text>
          <Text
            className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-5"
            numberOfLines={2}
          >
            {job.description.en}
          </Text>
          <View className="flex-row items-center justify-between pt-3 border-t border-gray-100 dark:border-neutral-700">
            <View className="flex-row items-center bg-gray-50 dark:bg-neutral-700/50 px-2.5 py-1.5 rounded-lg">
              <Ionicons name="people" size={14} color="#64748b" />
              <Text className="text-xs font-medium text-gray-600 dark:text-gray-400 ml-1.5">
                {job.masterCount} masters
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </View>
        </Pressable>
      ))}
    </View>
  );
}
