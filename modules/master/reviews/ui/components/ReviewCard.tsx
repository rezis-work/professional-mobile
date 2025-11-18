import { ThemedText } from "@/components/themed-text";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColorPalette } from "@/hooks/use-theme-color-palette";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";
import type { Review } from "../../types";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = useThemeColorPalette();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.cardBackground, borderColor: colors.border },
        isDark && styles.cardDark,
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: colors.secondaryBackground }]}>
          <ThemedText style={styles.avatarText} lightColor={colors.white} darkColor={colors.white}>
            {getInitials(review.client.fullName)}
          </ThemedText>
        </View>
        <View style={styles.headerInfo}>
          <ThemedText style={styles.clientName}>
            {review.client.fullName}
          </ThemedText>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={12} color={colors.mutedIcon} />
            <ThemedText style={styles.date}>
              {formatDate(review.createdAt)}
            </ThemedText>
          </View>
        </View>
        <View style={[styles.badge, getStatusStyle(review.status, colors)]}>
          <ThemedText style={styles.badgeText} lightColor={colors.white} darkColor={colors.white}>
            {review.status}
          </ThemedText>
        </View>
      </View>

      <View style={[styles.ratingSection, { backgroundColor: colors.secondaryBackground }]}>
        <View style={styles.mainRating}>
          <Ionicons name="star" size={24} color={colors.warning} />
          <ThemedText style={[styles.ratingValue, { color: colors.warning }]}>
            {review.averageRating.toFixed(1)}
          </ThemedText>
          <ThemedText style={styles.ratingMax}>/ 25</ThemedText>
        </View>
        {review.normalizedRating && (
          <ThemedText style={styles.normalizedText}>
            {t("reviews.normalized")}: {review.normalizedRating}
          </ThemedText>
        )}
      </View>

      <View style={styles.ratingsGrid}>
        <View style={styles.ratingItem}>
          <View style={styles.ratingLabelContainer}>
            <Ionicons name="cash" size={14} color={colors.mutedIcon} />
            <ThemedText style={styles.ratingLabel}>
              {t("reviews.price")}:
            </ThemedText>
          </View>
          <ThemedText style={[styles.ratingValueSmall, { color: colors.warning }]}>
            {review.ratingPrice}
          </ThemedText>
        </View>
        <View style={styles.ratingItem}>
          <View style={styles.ratingLabelContainer}>
            <Ionicons name="diamond" size={14} color={colors.mutedIcon} />
            <ThemedText style={styles.ratingLabel}>
              {t("reviews.quality")}:
            </ThemedText>
          </View>
          <ThemedText style={[styles.ratingValueSmall, { color: colors.warning }]}>
            {review.ratingQuality}
          </ThemedText>
        </View>
        <View style={styles.ratingItem}>
          <View style={styles.ratingLabelContainer}>
            <Ionicons name="time" size={14} color={colors.mutedIcon} />
            <ThemedText style={styles.ratingLabel}>
              {t("reviews.punctuality")}:
            </ThemedText>
          </View>
          <ThemedText style={[styles.ratingValueSmall, { color: colors.warning }]}>
            {review.ratingPunctuality}
          </ThemedText>
        </View>
        <View style={styles.ratingItem}>
          <View style={styles.ratingLabelContainer}>
            <Ionicons name="happy" size={14} color={colors.mutedIcon} />
            <ThemedText style={styles.ratingLabel}>
              {t("reviews.experience")}:
            </ThemedText>
          </View>
          <ThemedText style={[styles.ratingValueSmall, { color: colors.warning }]}>
            {review.ratingExperience}
          </ThemedText>
        </View>
      </View>

      {review.comment && (
        <View style={[styles.commentSection, { backgroundColor: colors.secondaryBackground }]}>
          <ThemedText style={styles.commentText}>{review.comment}</ThemedText>
        </View>
      )}

      {review.masterReply && (
        <View style={[styles.replySection, { backgroundColor: `${colors.primary}1A`, borderLeftColor: colors.primary }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="chatbubble-ellipses" size={16} color={colors.primary} />
            <ThemedText style={styles.sectionTitle}>
              {t("reviews.yourReply")}:
            </ThemedText>
          </View>
          <ThemedText style={styles.replyText}>{review.masterReply}</ThemedText>
        </View>
      )}
    </View>
  );
}

function getStatusStyle(status: string, colors: ReturnType<typeof useThemeColorPalette>) {
  switch (status.toLowerCase()) {
    case "approved":
      return { backgroundColor: colors.statusApproved };
    case "rejected":
      return { backgroundColor: colors.statusRejected };
    case "pending":
      return { backgroundColor: colors.statusPending };
    default:
      return { backgroundColor: colors.statusDefault };
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
  },
  headerInfo: {
    flex: 1,
    gap: 4,
  },
  clientName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 0,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  date: {
    fontSize: 12,
    opacity: 0.6,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  ratingSection: {
    marginBottom: 16,
    padding: 14,
    borderRadius: 10,
    gap: 6,
  },
  mainRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ratingValue: {
    fontSize: 28,
    fontWeight: "700",
  },
  ratingMax: {
    fontSize: 16,
    opacity: 0.6,
  },
  normalizedText: {
    fontSize: 12,
    opacity: 0.7,
  },
  ratingsGrid: {
    marginBottom: 16,
    gap: 10,
  },
  ratingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  ratingValueSmall: {
    fontSize: 16,
    fontWeight: "700",
  },
  commentSection: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 0,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  replySection: {
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    gap: 8,
  },
  replyText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9,
  },
});
