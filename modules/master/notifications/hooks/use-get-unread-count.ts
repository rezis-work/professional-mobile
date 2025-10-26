import { useQuery } from "@tanstack/react-query";
import { getUnreadCountNotifications } from "../services/notifications";
import type { UnreadCountNotificationsResponse } from "../types";

export const useGetUnreadCount = () => {
  return useQuery<UnreadCountNotificationsResponse>({
    queryKey: ["unread-notifications"],
    queryFn: getUnreadCountNotifications,
  });
};
