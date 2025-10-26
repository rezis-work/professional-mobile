import { ScrollView, View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useGetLeadById } from "../../hooks/use-get-lead-by-id";
import { ActionButtons } from "../components/ActionButtons";
import { useRouter } from "expo-router";

interface SingleLeadViewProps {
  leadId: string;
}

export function SingleLeadView({ leadId }: SingleLeadViewProps) {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useGetLeadById(leadId);

  const handleComplete = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ThemedText>Loading lead...</ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <ThemedText>Error loading lead</ThemedText>
        <ThemedText>{error.message}</ThemedText>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.centerContainer}>
        <ThemedText>Lead not found</ThemedText>
      </View>
    );
  }

  const lead = data.data;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const handleBackPress = () => {
    router.push("/(master)/leads");
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <ThemedText style={styles.backButtonText}>← Back</ThemedText>
        </TouchableOpacity>

        <ThemedText type="title" style={styles.title}>
          Lead Details
        </ThemedText>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Client Information
          </ThemedText>
          <View style={styles.infoRow}>
            <ThemedText style={styles.label}>Name:</ThemedText>
            <ThemedText style={styles.value}>{lead.client.fullName}</ThemedText>
          </View>
          <View style={styles.infoRow}>
            <ThemedText style={styles.label}>Email:</ThemedText>
            <ThemedText style={styles.value}>{lead.client.email}</ThemedText>
          </View>
          <View style={styles.infoRow}>
            <ThemedText style={styles.label}>Phone:</ThemedText>
            <ThemedText style={styles.value}>{lead.client.phone}</ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Job Details
          </ThemedText>
          <View style={styles.infoRow}>
            <ThemedText style={styles.label}>Job:</ThemedText>
            <ThemedText style={styles.value}>{lead.jobTitle.en}</ThemedText>
          </View>
          <View style={styles.infoRow}>
            <ThemedText style={styles.label}>Category:</ThemedText>
            <ThemedText style={styles.value}>{lead.categoryName.en}</ThemedText>
          </View>
          <View style={styles.infoRow}>
            <ThemedText style={styles.label}>Location:</ThemedText>
            <ThemedText style={styles.value}>{lead.location}</ThemedText>
          </View>
          <View style={styles.infoRow}>
            <ThemedText style={styles.label}>Requested Time:</ThemedText>
            <ThemedText style={styles.value}>
              {formatDate(lead.requestedTime)}
            </ThemedText>
          </View>
          <View style={styles.infoRow}>
            <ThemedText style={styles.label}>Status:</ThemedText>
            <ThemedText style={styles.value}>{lead.status}</ThemedText>
          </View>
          <View style={styles.infoRow}>
            <ThemedText style={styles.label}>Price:</ThemedText>
            <ThemedText style={[styles.value, styles.priceValue]}>
              {lead.price ? `${lead.price} ₾` : "Not set"}
            </ThemedText>
          </View>
        </View>

        {lead.message && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Client Message
            </ThemedText>
            <View style={styles.messageContainer}>
              <ThemedText style={styles.messageText}>{lead.message}</ThemedText>
            </View>
          </View>
        )}

        <ActionButtons
          leadId={lead.id}
          status={lead.status}
          onComplete={handleComplete}
        />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    color: "#2563eb",
    fontSize: 16,
  },
  title: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    marginBottom: 12,
    fontSize: 18,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    opacity: 0.7,
    flex: 1,
  },
  value: {
    fontSize: 14,
    flex: 2,
    textAlign: "right",
    fontWeight: "500",
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#10b981",
  },
  messageContainer: {
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
