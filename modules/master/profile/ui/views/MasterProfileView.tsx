import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  Image,
  Platform,
} from "react-native";
import { useAuth } from "@/lib/auth";
import { useMasterProfileById } from "@/modules/master/profile/hooks/useMasterProfileById";
import { useGetMasterLeadStats } from "@/modules/master/profile/hooks/use-get-master-lead-stats";
import { useTranslation } from "react-i18next";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";

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
        <ThemedText>{t("common.failedToLoadProfile")}</ThemedText>
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

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const cardBg = useThemeColor(
    { light: "#FFFFFF", dark: "#1F2937" },
    "background"
  );
  const backgroundColor = useThemeColor({}, "background");

  const getAvailabilityColor = (avail: string | null) => {
    switch (avail) {
      case "now":
        return "#10B981";
      case "tomorrow":
        return "#F59E0B";
      case "next_week":
        return "#3B82F6";
      case "on_holiday":
        return "#6B7280";
      default:
        return "#6B7280";
    }
  };

  const getAvailabilityText = (avail: string | null) => {
    switch (avail) {
      case "now":
        return t("settings.availabilityNow");
      case "tomorrow":
        return t("settings.availabilityTomorrow");
      case "next_week":
        return t("settings.availabilityNextWeek");
      case "on_holiday":
        return t("settings.availabilityOnHoliday");
      default:
        return "-";
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor }}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header Card */}
      <View
        style={[
          styles.card,
          { backgroundColor: cardBg },
          isDark && styles.cardDark,
        ]}
      >
        <View style={styles.profileHeader}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Ionicons name="person" size={40} color="#9CA3AF" />
            </View>
          )}
          <View style={styles.profileInfo}>
            <ThemedText type="title" style={styles.profileName}>
              {displayName}
            </ThemedText>
            {city && (
              <View style={styles.infoRow}>
                <Ionicons name="location" size={16} color="#6B7280" />
                <ThemedText style={styles.infoText}>{city}</ThemedText>
              </View>
            )}
            {availability && (
              <View style={styles.infoRow}>
                <View
                  style={[
                    styles.availabilityDot,
                    { backgroundColor: getAvailabilityColor(availability) },
                  ]}
                />
                <ThemedText style={styles.infoText}>
                  {getAvailabilityText(availability)}
                </ThemedText>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <View
          style={[
            styles.statCard,
            { backgroundColor: cardBg },
            isDark && styles.statCardDark,
          ]}
        >
          <View style={[styles.statIconContainer, { backgroundColor: "#3B82F6" }]}>
            <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
          </View>
          <ThemedText style={styles.statValue}>
            {masterStats.completedJobs ?? 0}
          </ThemedText>
          <ThemedText style={styles.statLabel}>
            {t("profile.completed")}
          </ThemedText>
        </View>

        <View
          style={[
            styles.statCard,
            { backgroundColor: cardBg },
            isDark && styles.statCardDark,
          ]}
        >
          <View style={[styles.statIconContainer, { backgroundColor: "#F59E0B" }]}>
            <Ionicons name="star" size={24} color="#FFFFFF" />
          </View>
          <ThemedText style={styles.statValue}>
            {(masterStats.averageRating ?? 0).toFixed(1)}
          </ThemedText>
          <ThemedText style={styles.statLabel}>
            {t("profile.avgRating")}
          </ThemedText>
        </View>

        <View
          style={[
            styles.statCard,
            { backgroundColor: cardBg },
            isDark && styles.statCardDark,
          ]}
        >
          <View style={[styles.statIconContainer, { backgroundColor: "#10B981" }]}>
            <Ionicons name="trophy" size={24} color="#FFFFFF" />
          </View>
          <ThemedText style={styles.statValue}>
            {masterStats.points ?? 0}
          </ThemedText>
          <ThemedText style={styles.statLabel}>
            {t("profile.points")}
          </ThemedText>
        </View>

        <View
          style={[
            styles.statCard,
            { backgroundColor: cardBg },
            isDark && styles.statCardDark,
          ]}
        >
          <View style={[styles.statIconContainer, { backgroundColor: "#8B5CF6" }]}>
            <Ionicons name="cash" size={24} color="#FFFFFF" />
          </View>
          <ThemedText style={styles.statValue}>
            {(masterStats.totalEarnings ?? 0).toFixed(0)}
          </ThemedText>
          <ThemedText style={styles.statLabel}>
            {t("profile.totalRevenue")}
          </ThemedText>
        </View>
      </View>

      {/* Bio Card */}
      {bio && (
        <View
          style={[
            styles.card,
            { backgroundColor: cardBg },
            isDark && styles.cardDark,
          ]}
        >
          <ThemedText type="subtitle" style={styles.cardTitle}>
            {t("profile.bio")}
          </ThemedText>
          <ThemedText style={styles.bioText}>{bio}</ThemedText>
        </View>
      )}

      {/* Lead Stats Card */}
      <View
        style={[
          styles.card,
          { backgroundColor: cardBg },
          isDark && styles.cardDark,
        ]}
      >
        <ThemedText type="subtitle" style={styles.cardTitle}>
          {t("profile.leadStats")}
        </ThemedText>
        <View style={styles.leadStatsGrid}>
          <View style={styles.leadStatItem}>
            <ThemedText style={styles.leadStatValue}>
              {totalLeads ?? 0}
            </ThemedText>
            <ThemedText style={styles.leadStatLabel}>
              {t("profile.total")}
            </ThemedText>
          </View>
          <View style={styles.leadStatItem}>
            <ThemedText style={styles.leadStatValue}>
              {pendingLeads ?? 0}
            </ThemedText>
            <ThemedText style={styles.leadStatLabel}>
              {t("common.pending")}
            </ThemedText>
          </View>
          <View style={styles.leadStatItem}>
            <ThemedText style={[styles.leadStatValue, { color: "#10B981" }]}>
              {acceptedLeads ?? 0}
            </ThemedText>
            <ThemedText style={styles.leadStatLabel}>
              {t("profile.accepted")}
            </ThemedText>
          </View>
          <View style={styles.leadStatItem}>
            <ThemedText style={[styles.leadStatValue, { color: "#EF4444" }]}>
              {declinedLeads ?? 0}
            </ThemedText>
            <ThemedText style={styles.leadStatLabel}>
              {t("profile.declined")}
            </ThemedText>
          </View>
        </View>
        <View style={styles.revenueRow}>
          <View style={styles.revenueItem}>
            <ThemedText style={styles.revenueLabel}>
              {t("profile.avgJobValue")}
            </ThemedText>
            <ThemedText style={styles.revenueValue}>
              {(averageJobValue ?? 0).toFixed(0)}
            </ThemedText>
          </View>
          <View style={styles.revenueItem}>
            <ThemedText style={styles.revenueLabel}>
              {t("profile.totalRevenue")}
            </ThemedText>
            <ThemedText style={styles.revenueValue}>
              {(totalRevenue ?? 0).toFixed(0)}
            </ThemedText>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardDark: {
    borderWidth: 1,
    borderColor: "#374151",
  },
  cardTitle: {
    marginBottom: 12,
    fontWeight: "600",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#E5E7EB",
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#E5E7EB",
  },
  profileInfo: {
    flex: 1,
    gap: 8,
  },
  profileName: {
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    opacity: 0.7,
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "47%",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  statCardDark: {
    borderWidth: 1,
    borderColor: "#374151",
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
  },
  bioText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  leadStatsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  leadStatItem: {
    flex: 1,
    minWidth: "47%",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(59, 130, 246, 0.05)",
  },
  leadStatValue: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  leadStatLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  revenueRow: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.05)",
  },
  revenueItem: {
    flex: 1,
    gap: 4,
  },
  revenueLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  revenueValue: {
    fontSize: 18,
    fontWeight: "700",
  },
});
