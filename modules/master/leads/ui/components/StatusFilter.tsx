import { Pressable, View, Text } from "react-native";
import { LeadStatus } from "../../types";
import { useTranslation } from "react-i18next";

interface StatusFilterProps {
  selectedStatus: LeadStatus;
  onStatusChange: (status: LeadStatus) => void;
}

export function StatusFilter({
  selectedStatus,
  onStatusChange,
}: StatusFilterProps) {
  const { t } = useTranslation();

  const statuses = [
    { value: LeadStatus.UNDEFINED, label: t("leads.all") },
    { value: LeadStatus.PENDING, label: t("common.pending") },
    { value: LeadStatus.ACCEPTED, label: t("profile.accepted") },
    { value: LeadStatus.COMPLETED, label: t("common.completed") },
    { value: LeadStatus.DECLINED, label: t("profile.declined") },
    { value: LeadStatus.CANCELLED, label: t("leads.cancelled") },
  ];

  return (
    <View className="flex-row flex-wrap gap-2">
      {statuses.map((status) => (
        <Pressable
          key={status.value}
          onPress={() => onStatusChange(status.value)}
          className={`px-4 py-2 rounded-full border ${
            selectedStatus === status.value
              ? "bg-blue-600 dark:bg-blue-700 border-blue-600 dark:border-blue-700"
              : "bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700"
          } active:opacity-70`}
        >
          <Text
            className={`text-sm font-semibold ${
              selectedStatus === status.value
                ? "text-white"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {status.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
