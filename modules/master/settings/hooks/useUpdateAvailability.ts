import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAvailability } from "../services/settings";

export function useUpdateAvailability(userId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (
      availability: "now" | "tomorrow" | "next_week" | "on_holiday"
    ) => updateAvailability(availability),
    onSuccess: async () => {
      if (userId) {
        await qc.invalidateQueries({ queryKey: ["master-profile", userId] });
      }
    },
  });
}
