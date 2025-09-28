import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeUnlockedMasterCity } from "../services/unlocked";

export const useDeleteUnlockedLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cityPartId: string) => removeUnlockedMasterCity(cityPartId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["unlocked-master-locations"],
      });
    },
  });
};
