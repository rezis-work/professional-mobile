import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../services/notifications";
import type { NotificationsResponse } from "../types";

export const useGetNotifications = (page: number, limit: number) => {
  return useQuery<NotificationsResponse>({
    queryKey: ["notifications", page, limit],
    queryFn: () => getNotifications({ page, limit }),
  });
};
