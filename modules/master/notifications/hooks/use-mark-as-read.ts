import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAsRead } from "../services/notifications";
import { Alert } from "react-native";
import type { NotificationsResponse } from "../types";

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => markAsRead(notificationId),
    onMutate: async (notificationId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      // Snapshot the previous value
      const previousNotifications = queryClient.getQueriesData<NotificationsResponse>({
        queryKey: ["notifications"],
      });

      // Optimistically update all notification queries
      queryClient.setQueriesData<NotificationsResponse>(
        { queryKey: ["notifications"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            notifications: old.notifications.map((notif) =>
              notif.id === notificationId ? { ...notif, read: true } : notif
            ),
          };
        }
      );

      return { previousNotifications };
    },
    onError: (err, notificationId, context) => {
      // Rollback on error
      if (context?.previousNotifications) {
        context.previousNotifications.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      Alert.alert("Error", "Failed to mark notification as read");
    },
    onSuccess: () => {
      // Mark queries as stale but don't refetch immediately
      // Optimistic update already updated the UI, so we just mark as stale
      // for background refetch when component remounts or user navigates
      queryClient.invalidateQueries({ 
        queryKey: ["notifications"],
        refetchType: 'none' // Don't trigger refetch, just mark as stale
      });
      queryClient.invalidateQueries({ 
        queryKey: ["unread-notifications"],
        refetchType: 'none'
      });
    },
  });
};
