import { useQuery } from "@tanstack/react-query";
import { getLeadsForMaster } from "../services/leads";
import type { LeadsResponse } from "../types";
import type { GetLeadsForMasterParams } from "../types";

export const useGetLeadsList = (params: GetLeadsForMasterParams) => {
  return useQuery<LeadsResponse, Error>({
    queryKey: ["leads", params.page, params.limit, params.status],
    queryFn: () => getLeadsForMaster(params),
  });
};
