import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAsRead } from "../services/notifications";
import type { NotificationsResponse } from "../types";

export const useMarkAsRead = (options?: { onError?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => markAsRead(notificationId),
    onMutate: async (notificationId: string) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      // Snapshot the previous values
      const previousData: Array<{ queryKey: readonly unknown[]; data: NotificationsResponse }> = [];
      const previousUnreadCount = queryClient.getQueryData(["unread-notifications"]);
      
      // Find all notification queries and update them optimistically
      queryClient.getQueryCache().findAll({ queryKey: ["notifications"] }).forEach((query) => {
        const data = query.state.data as NotificationsResponse | undefined;
        if (data) {
          // Store previous data for rollback
          previousData.push({
            queryKey: [...query.queryKey],
            data: data,
          });
          
          // Optimistically update the notification
          const updatedData: NotificationsResponse = {
            ...data,
            notifications: data.notifications.map((notification) =>
              notification.id === notificationId
                ? { ...notification, read: true, readAt: new Date().toISOString() }
                : notification
            ),
          };
          
          queryClient.setQueryData(query.queryKey, updatedData);
        }
      });

      // Optimistically update unread count
      if (previousUnreadCount && typeof previousUnreadCount === "object" && "unreadCount" in previousUnreadCount) {
        const currentCount = (previousUnreadCount as { unreadCount: number }).unreadCount;
        if (currentCount > 0) {
          queryClient.setQueryData(["unread-notifications"], {
            unreadCount: currentCount - 1,
          });
        }
      }

      return { previousData, previousUnreadCount };
    },
    onError: (err, notificationId, context) => {
      // Rollback optimistic update on error
      if (context?.previousData) {
        context.previousData.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousUnreadCount) {
        queryClient.setQueryData(["unread-notifications"], context.previousUnreadCount);
      }
      // Error handling is done in component via onError callback
      options?.onError?.();
    },
  });
};
