import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useMarkAsRead } from "../../hooks/use-mark-as-read";
import type { Notification } from "../../types";

interface NotificationCardProps {
  notification: Notification;
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const { mutate: markAsRead, isPending } = useMarkAsRead();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleMarkAsRead = () => {
    markAsRead(notification.id);
  };

  return (
    <View
      className={`p-4 rounded-2xl mb-3 border ${
        notification.read
          ? "bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700"
          : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
      }`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-row items-center flex-1 mr-3">
          <View
            className={`w-3 h-3 rounded-full mr-2 ${
              notification.read
                ? "bg-gray-400 dark:bg-gray-500"
                : "bg-blue-600 dark:bg-blue-500"
            }`}
          />
          <Text
            className="text-base font-bold text-text flex-1"
            numberOfLines={2}
          >
            {notification.title || notification.type.replace(/_/g, " ")}
          </Text>
        </View>
        <Text className="text-xs text-gray-500 dark:text-gray-400">
          {formatDate(notification.createdAt)}
        </Text>
      </View>

      <Text className="text-sm text-text leading-5 mb-3" numberOfLines={3}>
        {notification.message}
      </Text>

      {notification.data && Object.keys(notification.data).length > 0 && (
        <View className="bg-gray-100 dark:bg-neutral-700/50 p-3 rounded-xl mb-3">
          {notification.data.leadId && (
            <View className="flex-row justify-between mb-2">
              <Text className="text-xs text-gray-600 dark:text-gray-400">
                Lead ID:
              </Text>
              <Text className="text-xs font-semibold text-text">
                {notification.data.leadId}
              </Text>
            </View>
          )}
          {notification.data.amount && (
            <View className="flex-row justify-between mb-2">
              <Text className="text-xs text-gray-600 dark:text-gray-400">
                Amount:
              </Text>
              <Text className="text-xs font-semibold text-text">
                {notification.data.amount} ₾
              </Text>
            </View>
          )}
          {notification.data.clientName && (
            <View className="flex-row justify-between">
              <Text className="text-xs text-gray-600 dark:text-gray-400">
                Client:
              </Text>
              <Text className="text-xs font-semibold text-text">
                {notification.data.clientName}
              </Text>
            </View>
          )}
        </View>
      )}

      <Pressable
        onPress={handleMarkAsRead}
        disabled={isPending || notification.read}
        className={`self-end px-4 py-2 rounded-xl flex-row items-center ${
          notification.read
            ? "bg-gray-200 dark:bg-neutral-700"
            : "bg-blue-600 dark:bg-blue-700"
        } ${isPending || notification.read ? "opacity-50" : "active:opacity-80"}`}
      >
        {!notification.read && (
          <Ionicons
            name="checkmark-circle"
            size={16}
            color="white"
            style={{ marginRight: 6 }}
          />
        )}
        <Text
          className={`text-xs font-semibold ${
            notification.read
              ? "text-gray-600 dark:text-gray-400"
              : "text-white"
          }`}
        >
          {notification.read ? "Marked" : "Mark as Read"}
        </Text>
      </Pressable>
    </View>
  );
}
