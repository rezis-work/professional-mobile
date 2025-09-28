import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { ActivityIndicator, RefreshControl, ScrollView } from "react-native";
import { useAuth } from "@/lib/auth";
import { useMasterProfileById } from "@/modules/master/profile/hooks/useMasterProfileById";
import { useGetMasterLeadStats } from "@/modules/master/profile/hooks/use-get-master-lead-stats";
import { ProfileHeader } from "../components/ProfileHeader";
import { StatsRow } from "../components/StatsRow";
import { BioCard } from "../components/BioCard";
import { LeadStatsCard } from "../components/LeadStatsCard";

export function MasterProfileView() {
  const { user } = useAuth();
  const id = user?.id ?? "";
  const {
    data: profile,
    isLoading,
    isError,
    refetch: refetchProfile,
    isFetching: isFetchingProfile,
  } = useMasterProfileById(id);
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
    refetch: refetchStats,
    isFetching: isFetchingStats,
  } = useGetMasterLeadStats(id);

  if (!id) {
    return (
      <ThemedView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <ThemedText>No user</ThemedText>
      </ThemedView>
    );
  }

  if (isLoading || statsLoading) {
    return (
      <ThemedView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <ActivityIndicator />
      </ThemedView>
    );
  }

  if (isError || statsError || !profile || !stats) {
    return (
      <ThemedView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <ThemedText>Failed to load profile</ThemedText>
      </ThemedView>
    );
  }

  const bio = (profile as any)?.bio ?? null;
  const city = (profile as any)?.city ?? null;
  const imageUrl = (profile as any)?.imageUrl ?? null;
  const availability = (profile as any)?.availability ?? null;
  const masterStats = (profile as any)?.stats ?? {
    completedJobs: 0,
    totalReviews: 0,
    averageRating: 0,
    totalEarnings: 0,
    points: 0,
  };
  const displayName = (profile as any)?.user?.fullName ?? user?.fullName ?? "-";
  const {
    totalLeads,
    pendingLeads,
    acceptedLeads,
    averageJobValue,
    declinedLeads,
    totalRevenue,
  } = stats;

  const refreshing = isFetchingProfile || isFetchingStats;
  const onRefresh = async () => {
    await Promise.all([refetchProfile(), refetchStats()]);
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16, gap: 16 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ThemedView style={{ borderRadius: 12, padding: 16 }}>
        <ProfileHeader
          displayName={displayName}
          city={city}
          imageUrl={imageUrl}
          availability={availability}
        />
        <StatsRow
          completedJobs={masterStats.completedJobs}
          averageRating={masterStats.averageRating}
          points={masterStats.points}
        />
      </ThemedView>

      <BioCard bio={bio} />

      <LeadStatsCard
        totalLeads={totalLeads}
        pendingLeads={pendingLeads}
        acceptedLeads={acceptedLeads}
        declinedLeads={declinedLeads}
        averageJobValue={averageJobValue}
        totalRevenue={totalRevenue}
      />
    </ScrollView>
  );
}
