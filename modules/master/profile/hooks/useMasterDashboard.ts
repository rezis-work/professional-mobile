import { useQuery } from "@tanstack/react-query";
import { getMasterSelf } from "../services/profile";
import { getMasterLeadStats } from "../services/profile";
import { useAuth } from "@/lib/auth";

export function useMasterDashboard() {
  const { user } = useAuth();
  const id = user?.id ?? "";

  const profileQuery = useQuery({
    queryKey: ["master-profile", id],
    queryFn: () => getMasterSelf(),
    enabled: !!id,
  });

  const statsQuery = useQuery({
    queryKey: ["master-lead-stats", id],
    queryFn: () => getMasterLeadStats(id),
    enabled: !!id,
  });

  return {
    profile: profileQuery.data,
    stats: statsQuery.data,
    isLoading: profileQuery.isLoading || statsQuery.isLoading,
    isError: profileQuery.isError || statsQuery.isError,
    refetch: () => {
      profileQuery.refetch();
      statsQuery.refetch();
    },
    isFetching: profileQuery.isFetching || statsQuery.isFetching,
  };
}

