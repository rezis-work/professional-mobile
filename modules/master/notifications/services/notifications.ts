import api from "@/lib/api";
import type {
  NotificationsResponse,
  GetNotificationsParams,
  UnreadCountNotificationsResponse,
} from "../types";

export const getNotifications = async (
  params: GetNotificationsParams
): Promise<NotificationsResponse> => {
  const response = await api.get<NotificationsResponse>("/api/notifications", {
    params,
  });
  return response.data;
};

export const markAsRead = async (notificationId: string) => {
  const response = await api.patch(
    `/api/notifications/${notificationId}/read/master`
  );
  return response.data;
};

export const getUnreadCountNotifications =
  async (): Promise<UnreadCountNotificationsResponse> => {
    const response = await api.get<UnreadCountNotificationsResponse>(
      "/api/notifications/unread-count/master"
    );
    return response.data;
  };
