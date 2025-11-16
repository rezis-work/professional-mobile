import { ScreenHeader } from "@/components/ScreenHeader";
import { useAuth } from "@/lib/auth";
import { useGetMasterLeadStats } from "@/modules/master/profile/hooks/use-get-master-lead-stats";
import { useMasterProfileById } from "@/modules/master/profile/hooks/useMasterProfileById";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BioCard } from "../components/BioCard";
import { LeadStatsCard } from "../components/LeadStatsCard";
import { ProfileHeader } from "../components/ProfileHeader";
import { StatsRow } from "../components/StatsRow";

export function MasterProfileView() {
  const { user } = useAuth();
  const { t } = useTranslation();
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
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <ScreenHeader title={t("masterNavigation.masterProfile")} />
        <View className="flex-1 items-center justify-center">
          <Text className="text-text">{t("common.noUser")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading || statsLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <ScreenHeader title={t("masterNavigation.masterProfile")} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || statsError || !profile || !stats) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <ScreenHeader title={t("masterNavigation.masterProfile")} />
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-text text-center">
            {t("common.failedToLoadProfile")}
          </Text>
        </View>
      </SafeAreaView>
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
  const onRefresh = useCallback(async () => {
    await Promise.all([refetchProfile(), refetchStats()]);
  }, [refetchProfile, refetchStats]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScreenHeader title={t("masterNavigation.masterProfile")} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24, paddingTop: 16, gap: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header Card */}
        <View
          className="bg-white dark:bg-neutral-800 rounded-3xl p-6 border border-gray-200 dark:border-neutral-700 overflow-hidden"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 16,
            elevation: 6,
          }}
        >
          {/* Top Bar */}
          <View className="absolute top-0 left-0 right-0 h-2 bg-blue-500" />

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
        </View>

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
    </SafeAreaView>
  );
}
