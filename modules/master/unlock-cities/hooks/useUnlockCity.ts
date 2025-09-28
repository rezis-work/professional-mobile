import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unlockCity } from "../services/city";

export const useUnlockCity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      locationId,
      cityId,
      cityPartId,
    }: {
      locationId: string;
      cityId: string;
      cityPartId: string;
    }) => unlockCity(locationId, cityId, cityPartId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cities"] });
      queryClient.invalidateQueries({
        queryKey: ["unlocked-master-locations"],
      });
    },
  });
};
