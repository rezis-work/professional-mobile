import { useQuery } from "@tanstack/react-query";
import { getLeadForMasterById } from "../services/leads";
import type { SingleLeadResponse } from "../types";

export function useGetLeadById(id: string) {
  return useQuery<SingleLeadResponse, Error>({
    queryKey: ["lead", id],
    queryFn: () => getLeadForMasterById(id),
    enabled: !!id,
  });
}
