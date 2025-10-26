import { useQuery } from "@tanstack/react-query";
import { getMasterBillings } from "../services/billing";
import type { GetMasterBillingsParams, MasterBillingResponse } from "../types";

export const useGetMasterBillings = (params: GetMasterBillingsParams) => {
  return useQuery<MasterBillingResponse>({
    queryKey: ["master-billings", params.page, params.limit],
    queryFn: () => getMasterBillings(params),
  });
};
