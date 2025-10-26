import api from "@/lib/api";
import type { GetAllReviewsResponse, GetMasterReviewsParams } from "../types";

export const getMasterReviews = async (
  masterId: string,
  params: GetMasterReviewsParams
): Promise<GetAllReviewsResponse> => {
  const response = await api.get<GetAllReviewsResponse>(
    `/api/reviews/master/${masterId}`,
    {
      params,
    }
  );
  return response.data;
};
