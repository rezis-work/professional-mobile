export type User = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
};

export type MasterStats = {
  completedJobs: number;
  totalReviews: number;
  averageRating: number;
  totalEarnings: number;
  points: number;
};

export type MasterProfile = {
  bio: string | null;
  city: string | null;
  imageUrl: string | null;
  availability: string | null;
  createdAt: string;
  stats: MasterStats;
  user: User;
};

export type MasterLeadStats = {
  acceptedLeads: string;
  averageJobValue: number;
  completedLeads: string;
  declinedLeads: string;
  pendingLeads: string;
  totalLeads: number;
  totalRevenue: number | null;
};

export type MasterDashboard = {
  overview: {
    totalLeads: number;
    periodLeads: number;
    completedLeads: number;
    activeLeads: number;
    points: number;
    earnings: number;
  };
  stats: {
    rating: {
      average: number;
      total: number;
      distribution: Record<string, number>;
    };
    performance: {
      completionRate: number;
      responseTime: number;
      repeatClientRate: number;
    };
  };
};
