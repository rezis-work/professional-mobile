import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignJob } from "../services/assign";

export const useAssignJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      jobId,
      priceMin,
      priceMax,
      durationMinutes,
      note,
      isActive,
    }: {
      jobId: string;
      priceMin: number;
      priceMax: number;
      durationMinutes?: number;
      note?: string;
      isActive: boolean;
    }) => assignJob(jobId, priceMin, priceMax, durationMinutes, note, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs-by-category"] });
    },
  });
};
