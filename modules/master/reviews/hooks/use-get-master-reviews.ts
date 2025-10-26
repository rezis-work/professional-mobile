import { useQuery } from "@tanstack/react-query";
import { getMasterReviews } from "../services/reviews";
import type { GetMasterReviewsParams, GetAllReviewsResponse } from "../types";
import { useAuth } from "@/lib/auth";

export const useGetMasterReviews = (params: GetMasterReviewsParams) => {
  const { user } = useAuth();

  return useQuery<GetAllReviewsResponse>({
    queryKey: [
      "master-reviews",
      user?.id,
      params.page,
      params.limit,
      params.status,
      params.hasReply,
      params.sortBy,
    ],
    queryFn: () => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      return getMasterReviews(user.id, params);
    },
    enabled: !!user?.id,
  });
};
