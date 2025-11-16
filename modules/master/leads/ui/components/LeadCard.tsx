import { Pressable, View, Text } from "react-native";
import type { Lead } from "../../types";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

interface LeadCardProps {
  lead: Lead;
}

export function LeadCard({ lead }: LeadCardProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#f59e0b";
      case "accepted":
        return "#3b82f6";
      case "completed":
        return "#10b981";
      case "declined":
        return "#ef4444";
      case "cancelled":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <Pressable
      onPress={() => router.push(`/(master)/leads/${lead.id}`)}
      className="mb-4 bg-white dark:bg-neutral-800 rounded-2xl border border-gray-200 dark:border-neutral-700 overflow-hidden active:opacity-90"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View className="p-5">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-text flex-1 mr-3">
            {lead.client.fullName}
          </Text>
          <View
            className="px-3 py-1.5 rounded-xl"
            style={{ backgroundColor: getStatusColor(lead.status) }}
          >
            <Text className="text-white text-xs font-bold">
              {lead.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between mb-3">
          <Text className="text-sm text-gray-600 dark:text-gray-400 flex-1">
            {t("leads.job")}:
          </Text>
          <Text className="text-sm font-semibold text-text flex-2 text-right">
            {lead.jobTitle.en}
          </Text>
        </View>

        <View className="flex-row justify-between mb-3">
          <Text className="text-sm text-gray-600 dark:text-gray-400 flex-1">
            {t("leads.location")}:
          </Text>
          <Text className="text-sm font-semibold text-text flex-2 text-right">
            {lead.location}
          </Text>
        </View>

        <View className="flex-row justify-between mb-3">
          <Text className="text-sm text-gray-600 dark:text-gray-400 flex-1">
            {t("leads.requestedTime")}:
          </Text>
          <Text className="text-sm font-semibold text-text flex-2 text-right">
            {formatDate(lead.requestedTime)}
          </Text>
        </View>

        <View className="flex-row justify-between mb-3">
          <Text className="text-sm text-gray-600 dark:text-gray-400 flex-1">
            {t("leads.price")}:
          </Text>
          <Text className="text-base font-bold text-green-600 dark:text-green-400 flex-2 text-right">
            {lead.price ? `${lead.price} ₾` : t("leads.notSet")}
          </Text>
        </View>

        {lead.message && (
          <View className="mt-3 pt-4 border-t border-gray-200 dark:border-neutral-700">
            <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {t("leads.message")}:
            </Text>
            <Text className="text-sm text-text leading-5" numberOfLines={2}>
              {lead.message}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}
