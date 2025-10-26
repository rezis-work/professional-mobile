import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import type { Review } from "../../types";
import { useTranslation } from "react-i18next";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const { t } = useTranslation();

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
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <ThemedText style={styles.avatarText}>
            {getInitials(review.client.fullName)}
          </ThemedText>
        </View>
        <View style={styles.headerInfo}>
          <ThemedText style={styles.clientName}>
            {review.client.fullName}
          </ThemedText>
          <ThemedText style={styles.date}>
            {formatDate(review.createdAt)}
          </ThemedText>
        </View>
        <View style={[styles.badge, getStatusStyle(review.status)]}>
          <ThemedText style={styles.badgeText}>{review.status}</ThemedText>
        </View>
      </View>

      <View style={styles.ratingSection}>
        <View style={styles.mainRating}>
          <ThemedText style={styles.ratingValue}>
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
          <ThemedText style={styles.ratingLabel}>
            {t("reviews.price")}:
          </ThemedText>
          <ThemedText style={styles.ratingValue}>
            {review.ratingPrice}
          </ThemedText>
        </View>
        <View style={styles.ratingItem}>
          <ThemedText style={styles.ratingLabel}>
            {t("reviews.quality")}:
          </ThemedText>
          <ThemedText style={styles.ratingValue}>
            {review.ratingQuality}
          </ThemedText>
        </View>
        <View style={styles.ratingItem}>
          <ThemedText style={styles.ratingLabel}>
            {t("reviews.punctuality")}:
          </ThemedText>
          <ThemedText style={styles.ratingValue}>
            {review.ratingPunctuality}
          </ThemedText>
        </View>
        <View style={styles.ratingItem}>
          <ThemedText style={styles.ratingLabel}>
            {t("reviews.experience")}:
          </ThemedText>
          <ThemedText style={styles.ratingValue}>
            {review.ratingExperience}
          </ThemedText>
        </View>
      </View>

      {review.comment && (
        <View style={styles.commentSection}>
          <ThemedText style={styles.sectionTitle}>
            {t("reviews.comment")}:
          </ThemedText>
          <ThemedText style={styles.commentText}>{review.comment}</ThemedText>
        </View>
      )}

      {review.masterReply && (
        <View style={styles.replySection}>
          <ThemedText style={styles.sectionTitle}>
            {t("reviews.yourReply")}:
          </ThemedText>
          <ThemedText style={styles.replyText}>{review.masterReply}</ThemedText>
        </View>
      )}
    </ThemedView>
  );
}

function getStatusStyle(status: string) {
  switch (status.toLowerCase()) {
    case "approved":
      return { backgroundColor: "#10b981" };
    case "rejected":
      return { backgroundColor: "#ef4444" };
    case "pending":
      return { backgroundColor: "#f59e0b" };
    default:
      return { backgroundColor: "#6b7280" };
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  headerInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    opacity: 0.6,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  ratingSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
  },
  mainRating: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 4,
  },
  ratingValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#f59e0b",
  },
  ratingMax: {
    fontSize: 14,
    opacity: 0.6,
    marginLeft: 4,
  },
  normalizedText: {
    fontSize: 12,
    opacity: 0.7,
  },
  ratingsGrid: {
    marginBottom: 16,
  },
  ratingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  commentSection: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  replySection: {
    padding: 12,
    backgroundColor: "#eff6ff",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },
  replyText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
