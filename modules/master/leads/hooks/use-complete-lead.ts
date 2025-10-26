import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeLead } from "../services/leads";
import type { CompleteLeadParams } from "../types";

export const useCompleteLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ leadId, price }: CompleteLeadParams) =>
      completeLead({ leadId, price }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
};
