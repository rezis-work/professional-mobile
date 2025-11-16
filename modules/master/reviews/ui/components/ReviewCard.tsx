import { View, Text } from "react-native";
import type { Review } from "../../types";
import { useTranslation } from "react-i18next";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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
      <View className="flex-row items-center mb-4 gap-3">
        <View className="w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-700 items-center justify-center">
          <Text className="text-white text-sm font-bold">
            {getInitials(review.client.fullName)}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-base font-bold text-gray-900 dark:text-white mb-1">
            {review.client.fullName}
          </Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(review.createdAt)}
          </Text>
        </View>
        <View className={`px-3 py-1.5 rounded-xl ${getStatusColor(review.status)}`}>
          <Text className="text-white text-xs font-semibold capitalize">
            {review.status}
          </Text>
        </View>
      </View>

      <View className="bg-gray-50 dark:bg-neutral-700/50 rounded-xl p-3 mb-4">
        <View className="flex-row items-baseline mb-2">
          <Text className="text-2xl font-bold text-amber-500 dark:text-amber-400">
            {review.averageRating.toFixed(1)}
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 ml-1">
            / 25
          </Text>
        </View>
        {review.normalizedRating && (
          <Text className="text-xs text-gray-600 dark:text-gray-400">
            {t("reviews.normalized")}: {review.normalizedRating}
          </Text>
        )}
      </View>

      <View className="mb-4">
        <View className="flex-row justify-between mb-2">
          <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t("reviews.price")}:
          </Text>
          <Text className="text-sm font-bold text-gray-900 dark:text-white">
            {review.ratingPrice}
          </Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t("reviews.quality")}:
          </Text>
          <Text className="text-sm font-bold text-gray-900 dark:text-white">
            {review.ratingQuality}
          </Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t("reviews.punctuality")}:
          </Text>
          <Text className="text-sm font-bold text-gray-900 dark:text-white">
            {review.ratingPunctuality}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t("reviews.experience")}:
          </Text>
          <Text className="text-sm font-bold text-gray-900 dark:text-white">
            {review.ratingExperience}
          </Text>
        </View>
      </View>

      {review.comment && (
        <View className="bg-gray-50 dark:bg-neutral-700/50 rounded-xl p-3 mb-3">
          <Text className="text-sm font-bold text-gray-900 dark:text-white mb-2">
            {t("reviews.comment")}:
          </Text>
          <Text className="text-sm text-gray-700 dark:text-gray-300 leading-5">
            {review.comment}
          </Text>
        </View>
      )}

      {review.masterReply && (
        <View className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 border-l-4 border-blue-500 dark:border-blue-400">
          <Text className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-2">
            {t("reviews.yourReply")}:
          </Text>
          <Text className="text-sm text-blue-800 dark:text-blue-200 leading-5">
            {review.masterReply}
          </Text>
        </View>
      )}
    </View>
  );
}
