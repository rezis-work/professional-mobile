export interface ReviewClient {
  fullName: string;
}

export interface Review {
  id: string;
  leadId: string;
  masterId: string;
  clientId: string;
  ratingPrice: number;
  ratingQuality: number;
  ratingPunctuality: number;
  ratingExperience: number;
  comment: string;
  masterReply?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  client: ReviewClient;
  lead?: {
    jobTitle: {
      en: string;
      ka: string;
      ru: string;
    };
    price?: string;
  };
  averageRating: number;
  normalizedRating?: number;
}

export interface ReviewsPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface GetAllReviewsResponse {
  success: boolean;
  data: {
    reviews: Review[];
    pagination: ReviewsPagination;
  };
}

export enum ReviewStatus {
  UNDEFINED = "",
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface GetMasterReviewsParams {
  page: number;
  limit: number;
  status?: string;
  hasReply?: boolean;
  sortBy?: string;
}
