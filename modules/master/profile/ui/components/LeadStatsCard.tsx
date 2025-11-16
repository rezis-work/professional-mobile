import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export function LeadStatsCard({
  totalLeads,
  pendingLeads,
  acceptedLeads,
  declinedLeads,
  averageJobValue,
  totalRevenue,
}: {
  totalLeads: number;
  pendingLeads: number | string;
  acceptedLeads: number | string;
  declinedLeads: number | string;
  averageJobValue: number;
  totalRevenue: number | null;
}) {
  const { t } = useTranslation();

  const stats = [
    {
      label: t("profile.total"),
      value: totalLeads,
      icon: "list" as const,
      color: "#2563eb",
    },
    {
      label: t("common.pending"),
      value: pendingLeads,
      icon: "time-outline" as const,
      color: "#f59e0b",
    },
    {
      label: t("profile.accepted"),
      value: acceptedLeads,
      icon: "checkmark-circle" as const,
      color: "#10b981",
    },
    {
      label: t("profile.declined"),
      value: declinedLeads,
      icon: "close-circle" as const,
      color: "#ef4444",
    },
    {
      label: t("profile.avgJobValue"),
      value: `₾${averageJobValue}`,
      icon: "cash-outline" as const,
      color: "#8b5cf6",
    },
    {
      label: t("profile.totalRevenue"),
      value: `₾${totalRevenue ?? 0}`,
      icon: "wallet-outline" as const,
      color: "#06b6d4",
    },
  ];

  return (
    <View
      className="bg-white dark:bg-neutral-800 rounded-3xl p-6 border border-gray-200 dark:border-neutral-700"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
      }}
    >
      {/* Header */}
      <View className="flex-row items-center mb-5">
        <View className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2.5 mr-3">
          <Ionicons name="stats-chart" size={22} color="#2563eb" />
        </View>
        <Text className="text-xl font-extrabold text-text">
          {t("profile.leadStats")}
        </Text>
      </View>

      {/* Stats Grid */}
      <View className="flex-row flex-wrap gap-3">
        {stats.map((stat, index) => (
          <View
            key={index}
            className="w-[48%] bg-gray-50 dark:bg-neutral-700/30 rounded-2xl p-4 border border-gray-200 dark:border-neutral-600"
          >
            <View className="flex-row items-center mb-2">
              <View
                className="rounded-full p-1.5 mr-2"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <Ionicons name={stat.icon} size={16} color={stat.color} />
              </View>
              <Text
                className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex-1"
                numberOfLines={1}
              >
                {stat.label}
              </Text>
            </View>
            <Text className="text-xl font-extrabold text-text">
              {stat.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
