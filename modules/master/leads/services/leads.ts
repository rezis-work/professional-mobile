import api from "@/lib/api";
import type {
  LeadsResponse,
  SingleLeadResponse,
  GetLeadsForMasterParams,
  LeadStatus,
  CompleteLeadParams,
} from "../types";

export async function getLeadsForMaster({
  page,
  limit,
  status,
}: GetLeadsForMasterParams): Promise<LeadsResponse> {
  const response = await api.get<LeadsResponse>("/api/leads/master", {
    params: {
      page,
      limit,
      status,
    },
  });
  return response.data;
}

export async function getLeadForMasterById(
  id: string
): Promise<SingleLeadResponse> {
  const response = await api.get<SingleLeadResponse>(
    `/api/leads/master/lead/${id}`
  );
  return response.data;
}

export async function acceptDeclineLead(
  id: string,
  status: LeadStatus
): Promise<any> {
  const response = await api.patch(`/api/leads/${id}/status/master`, {
    status,
  });
  return response.data;
}

export async function completeLead({
  leadId,
  price,
}: CompleteLeadParams): Promise<any> {
  const response = await api.patch(`/api/leads/complete`, {
    leadId,
    price,
  });
  return response.data;
}
