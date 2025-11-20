import { useGetMasterLeadStats } from "./use-get-master-lead-stats";
import { useMasterProfileById } from "./useMasterProfileById";

export function useMasterDashboard(id: string) {
  const profileQuery = useMasterProfileById(id);
  const statsQuery = useGetMasterLeadStats(id);

  return {
    profile: profileQuery.data,
    stats: statsQuery.data,
    isLoading: profileQuery.isLoading || statsQuery.isLoading,
    isError: profileQuery.isError || statsQuery.isError,
    refetch: async () => {
      await Promise.all([
        profileQuery.refetch(),
        statsQuery.refetch(),
      ]);
    },
    isFetching: profileQuery.isFetching || statsQuery.isFetching,
  };
}

