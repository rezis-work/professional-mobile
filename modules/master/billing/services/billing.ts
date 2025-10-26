import api from "@/lib/api";
import type { MasterBillingResponse, GetMasterBillingsParams } from "../types";

export const getMasterBillings = async (
  params: GetMasterBillingsParams
): Promise<MasterBillingResponse> => {
  const response = await api.get<MasterBillingResponse>(
    "/api/billing/my-billing",
    {
      params,
    }
  );
  return response.data;
};

export const uploadMasterProof = async (data: FormData): Promise<any> => {
  const response = await api.post("/api/billing/upload-proof", data as any, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
