import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

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

  const stats = [
    {
      label: t("profile.completed"),
      value: completedJobs,
      icon: "checkmark-circle" as const,
      color: "#10b981",
    },
    {
      label: t("profile.avgRating"),
      value: averageRating.toFixed(1),
      icon: "star" as const,
      color: "#f59e0b",
    },
    {
      label: t("profile.points"),
      value: points,
      icon: "trophy" as const,
      color: "#8b5cf6",
    },
  ];

  return (
    <View className="flex-row justify-around pt-4 border-t border-gray-200 dark:border-neutral-700 gap-2">
      {stats.map((stat, index) => (
        <View
          key={index}
          className="items-center flex-1 bg-gray-50 dark:bg-neutral-700/30 rounded-xl py-3"
        >
          <View
            className="rounded-full p-2 mb-2"
            style={{ backgroundColor: `${stat.color}20` }}
          >
            <Ionicons name={stat.icon} size={20} color={stat.color} />
          </View>
          <Text className="text-2xl font-extrabold text-text mb-1">
            {stat.value}
          </Text>
          <Text className="text-xs font-semibold text-gray-600 dark:text-gray-400 text-center px-1">
            {stat.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
