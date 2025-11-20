import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuth } from "@/lib/auth";
import { useMasterDashboard } from "@/modules/master/profile/hooks/useMasterDashboard";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MasterDashboardScreen() {
  const { logout, user, refetch: refetchAuth } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const id = user?.id ?? "";
  const { profile, stats, isLoading, refetch, isFetching } =
    useMasterDashboard(id);

  const backgroundColor = useThemeColor({}, "background");
  const cardBg = useThemeColor({}, "cardBackground");
  const tint = useThemeColor({}, "tint");
  const statBlue = useThemeColor({}, "statBlue");
  const statAmber = useThemeColor({}, "statAmber");
  const statGreen = useThemeColor({}, "statGreen");
  const statPurple = useThemeColor({}, "statPurple");
  const error = useThemeColor({}, "error");
  const white = useThemeColor({}, "white");

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchAuth(), refetch()]);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Navigation will happen automatically via app/index.tsx redirect when user becomes null
    } catch {
      Alert.alert(t("common.error"), t("common.logoutFailed"));
    }
  };

  // Show loading only if id exists and we're actually loading (first time)
  if (id && isLoading && !profile && !stats) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          Platform.OS === "ios" && { paddingBottom: 100 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={tint}
            colors={[tint]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        {user && (
          <View style={styles.header}>
            <ThemedText style={styles.userName}>{user.fullName}</ThemedText>
          </View>
        )}

        {/* Language Switcher Section */}
        <View style={styles.languageSection}>
          <LanguageSwitcher />
        </View>

        {/* Stats Cards */}
        {profile?.stats && (
          <View style={styles.statsGrid}>
            <View
              style={[
                styles.statCard,
                { backgroundColor: cardBg },
                isDark && styles.statCardDark,
              ]}
            >
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: statBlue },
                ]}
              >
                <Ionicons name="checkmark-circle" size={24} color={white} />
              </View>
              <ThemedText style={styles.statValue}>
                {profile.stats.completedJobs ?? 0}
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
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: statAmber },
                ]}
              >
                <Ionicons name="star" size={24} color={white} />
              </View>
              <ThemedText style={styles.statValue}>
                {(profile.stats.averageRating ?? 0).toFixed(1)}
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
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: statGreen },
                ]}
              >
                <Ionicons name="trophy" size={24} color={white} />
              </View>
              <ThemedText style={styles.statValue}>
                {profile.stats.points ?? 0}
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
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: statPurple },
                ]}
              >
                <Ionicons name="cash" size={24} color={white} />
              </View>
              <ThemedText style={styles.statValue}>
                {(profile.stats.totalEarnings ?? 0).toFixed(0)}
              </ThemedText>
              <ThemedText style={styles.statLabel}>
                {t("profile.totalRevenue")}
              </ThemedText>
            </View>
          </View>
        )}

        {/* Lead Stats Card */}
        {stats && (
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
                  {stats.totalLeads ?? 0}
                </ThemedText>
                <ThemedText style={styles.leadStatLabel}>
                  {t("profile.total")}
                </ThemedText>
              </View>
              <View style={styles.leadStatItem}>
                <ThemedText style={styles.leadStatValue}>
                  {stats.pendingLeads ?? 0}
                </ThemedText>
                <ThemedText style={styles.leadStatLabel}>
                  {t("common.pending")}
                </ThemedText>
              </View>
              <View style={styles.leadStatItem}>
                <ThemedText
                  style={[styles.leadStatValue, { color: statGreen }]}
                >
                  {stats.acceptedLeads ?? 0}
                </ThemedText>
                <ThemedText style={styles.leadStatLabel}>
                  {t("profile.accepted")}
                </ThemedText>
              </View>
              <View style={styles.leadStatItem}>
                <ThemedText style={[styles.leadStatValue, { color: error }]}>
                  {stats.declinedLeads ?? 0}
                </ThemedText>
                <ThemedText style={styles.leadStatLabel}>
                  {t("profile.declined")}
                </ThemedText>
              </View>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: cardBg }]}
            onPress={() => router.push("/(master)/leads")}
          >
            <Ionicons name="people" size={24} color={tint} />
            <ThemedText style={styles.actionText}>
              {t("masterNavigation.leads")}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: cardBg }]}
            onPress={() => router.push("/(master)/reviews")}
          >
            <Ionicons name="star" size={24} color={tint} />
            <ThemedText style={styles.actionText}>
              {t("masterNavigation.reviews")}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: cardBg }]}
            onPress={() => router.push("/(master)/billing")}
          >
            <Ionicons name="card" size={24} color={tint} />
            <ThemedText style={styles.actionText}>
              {t("masterNavigation.billing")}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: cardBg }]}
            onPress={() => router.push("/(master)/notifications")}
          >
            <Ionicons name="notifications" size={24} color={tint} />
            <ThemedText style={styles.actionText}>
              {t("masterNavigation.notifications")}
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: error }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color={white} />
          <ThemedText style={styles.logoutText}>
            {t("common.logout")}
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  header: {
    marginTop: -8,
    marginBottom: 12,
  },
  userName: {
    fontSize: 14,
    opacity: 0.7,
    fontWeight: "500",
  },
  languageSection: {
    marginBottom: 8,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCardDark: {
    shadowOpacity: 0.3,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
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
  card: {
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardDark: {
    shadowOpacity: 0.3,
  },
  cardTitle: {
    marginBottom: 4,
  },
  leadStatsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  leadStatItem: {
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
    gap: 4,
  },
  leadStatValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  leadStatLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: "47%",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
