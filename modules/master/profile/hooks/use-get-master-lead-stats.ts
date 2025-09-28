import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getMasterLeadStats } from "../services/profile";
import type { MasterLeadStats } from "../types";

export const useGetMasterLeadStats = (
  id: string
): UseQueryResult<MasterLeadStats, Error> => {
  return useQuery<MasterLeadStats, Error>({
    queryKey: ["master-lead-stats", id],
    queryFn: () => getMasterLeadStats(id),
    enabled: !!id,
  });
};
