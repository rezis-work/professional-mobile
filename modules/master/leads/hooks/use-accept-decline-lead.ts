import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptDeclineLead } from "../services/leads";
import { LeadStatus } from "../types";

export function useAcceptDeclineLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: LeadStatus }) =>
      acceptDeclineLead(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}
