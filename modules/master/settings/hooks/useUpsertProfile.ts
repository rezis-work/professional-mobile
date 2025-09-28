import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertMasterProfile } from "../services/settings";

export function useUpsertProfile(userId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: upsertMasterProfile,
    onSuccess: async () => {
      if (userId) {
        await qc.invalidateQueries({ queryKey: ["master-profile", userId] });
      }
    },
  });
}
