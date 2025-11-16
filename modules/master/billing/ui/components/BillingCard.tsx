import { View, Text, Pressable } from "react-native";
import type { MasterBillingItem } from "../../types";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

interface BillingCardProps {
  billing: MasterBillingItem;
  onUploadProof: () => void;
}

export function BillingCard({ billing, onUploadProof }: BillingCardProps) {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      case "pending":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <View className="bg-white dark:bg-neutral-800 rounded-2xl p-4 mb-3 border border-gray-200 dark:border-neutral-700 shadow-sm">
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            {t("billing.billing")} #{billing.id.slice(0, 8)}
          </Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400">
            {t("billing.created")}: {formatDate(billing.createdAt)}
          </Text>
        </View>
        <View className={`px-3 py-1.5 rounded-xl ${getStatusColor(billing.status)}`}>
          <Text className="text-white text-xs font-semibold capitalize">
            {billing.status}
          </Text>
        </View>
      </View>

      <View className="flex-row gap-2 mb-4">
        <View className="flex-1 bg-gray-50 dark:bg-neutral-700/50 rounded-xl p-3">
          <Text className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            {t("billing.totalJobs")}
          </Text>
          <Text className="text-base font-bold text-gray-900 dark:text-white">
            {billing.totalJobs}
          </Text>
        </View>
        <View className="flex-1 bg-gray-50 dark:bg-neutral-700/50 rounded-xl p-3">
          <Text className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            {t("billing.totalAmount")}
          </Text>
          <Text className="text-base font-bold text-gray-900 dark:text-white">
            {billing.totalAmount}₾
          </Text>
        </View>
        <View className="flex-1 bg-gray-50 dark:bg-neutral-700/50 rounded-xl p-3">
          <Text className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            {t("billing.adminFee")}
          </Text>
          <Text className="text-base font-bold text-gray-900 dark:text-white">
            {billing.adminFee}₾
          </Text>
        </View>
      </View>

      <View className="mb-3">
        <Text className="text-xs text-gray-600 dark:text-gray-400 mb-1">
          {t("billing.week")}: {formatDate(billing.weekStart)} - {formatDate(billing.weekEnd)}
        </Text>
        <Text className="text-xs text-gray-600 dark:text-gray-400">
          {t("billing.dueDate")}: {formatDate(billing.dueDate)}
        </Text>
      </View>

      {billing.adminNote && (
        <View className="pt-3 border-t border-gray-200 dark:border-neutral-700 mb-3">
          <Text className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            {t("billing.adminNote")}:
          </Text>
          <Text className="text-sm text-gray-900 dark:text-white">
            {billing.adminNote}
          </Text>
        </View>
      )}

      <View className="pt-3 border-t border-gray-200 dark:border-neutral-700 mb-4">
        <Text className="text-xs text-gray-600 dark:text-gray-400">
          {t("billing.remindersSent")}: {billing.remindersSent}
        </Text>
      </View>

      <Pressable
        onPress={onUploadProof}
        className="bg-blue-600 dark:bg-blue-700 py-3 rounded-xl items-center active:opacity-70"
      >
        <View className="flex-row items-center gap-2">
          <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
          <Text className="text-white text-base font-semibold">
            {t("billing.uploadProof")}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
