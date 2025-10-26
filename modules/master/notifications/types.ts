export interface Notification {
  id: string;
  masterId: string;
  type: string;
  title: string | null;
  message: string;
  data: {
    leadId?: string;
    amount?: number;
    dueDate?: string;
    weekEnd?: string;
    totalJobs?: number;
    weekStart?: string;
    totalAmount?: number;
    billingLogId?: string;
    jobTitle?: {
      en: string;
      ka: string;
      ru: string;
    };
    reviewId?: string;
    averageRating?: number;
    normalizedRating?: number;
    location?: string;
    clientName?: string;
    priceRange?: string;
  };
  priority: string;
  read: boolean;
  readAt: string | null;
  emailSent: boolean;
  smsSent: boolean;
  pushSent: boolean;
  scheduledFor: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: string;
  limit: string;
  total: number;
  totalPages: number;
}

export interface NotificationsResponse {
  notifications: Notification[];
  pagination: Pagination;
}

export interface UnreadCountNotificationsResponse {
  unreadCount: number;
}

export interface GetNotificationsParams {
  page: number;
  limit: number;
}
