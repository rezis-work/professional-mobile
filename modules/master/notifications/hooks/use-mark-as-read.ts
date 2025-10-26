import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAsRead } from "../services/notifications";
import { Alert } from "react-native";

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-notifications"] });
    },
    onError: () => {
      Alert.alert("Error", "Failed to mark notification as read");
    },
  });
};
