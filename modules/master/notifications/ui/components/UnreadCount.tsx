import { Text, View } from "react-native";
import { useGetUnreadCount } from "../../hooks/use-get-unread-count";

export function UnreadCount() {
  const { data, isLoading } = useGetUnreadCount();

  if (isLoading || !data || data.unreadCount === 0) {
    return null;
  }

  // If count is very small, show just a dot
  if (data.unreadCount <= 0) {
    return null;
  }

  return (
    <View
      className="bg-red-500 rounded-full items-center justify-center border-2 border-white dark:border-neutral-900"
      style={{
        minWidth: data.unreadCount > 9 ? 24 : 20,
        height: 20,
        paddingHorizontal: data.unreadCount > 9 ? 6 : 4,
        shadowColor: "#ef4444",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5,
      }}
    >
      <Text className="text-white text-[10px] font-extrabold leading-none">
        {data.unreadCount > 99 ? "99+" : data.unreadCount}
      </Text>
    </View>
  );
}
