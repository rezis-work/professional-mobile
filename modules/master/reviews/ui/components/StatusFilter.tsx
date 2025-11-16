import { Pressable, View, Text } from "react-native";
import { ReviewStatus } from "../../types";
import { useTranslation } from "react-i18next";

interface StatusFilterProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

export function StatusFilter({
  selectedStatus,
  onStatusChange,
}: StatusFilterProps) {
  const { t } = useTranslation();

  const statuses = [
    { label: t("reviews.all"), value: ReviewStatus.UNDEFINED },
    { label: t("common.pending"), value: ReviewStatus.PENDING },
    { label: t("common.approved"), value: ReviewStatus.APPROVED },
    { label: t("common.rejected"), value: ReviewStatus.REJECTED },
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
