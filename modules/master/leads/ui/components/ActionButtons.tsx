import { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { useAcceptDeclineLead } from "../../hooks/use-accept-decline-lead";
import { LeadStatus } from "../../types";
import { CompleteLeadModal } from "./CompleteLeadModal";

interface ActionButtonsProps {
  leadId: string;
  status: string;
  onComplete?: () => void;
}

export function ActionButtons({
  leadId,
  status,
  onComplete,
}: ActionButtonsProps) {
  const { mutate: acceptDeclineLead, isPending: isAcceptDeclinePending } =
    useAcceptDeclineLead();
  const [isCompleteModalVisible, setIsCompleteModalVisible] = useState(false);

  const handleAccept = () => {
    if (status !== "pending") {
      Alert.alert(
        "Cannot Accept",
        "This lead cannot be accepted. Only pending leads can be accepted."
      );
      return;
    }
    acceptDeclineLead(
      { id: leadId, status: LeadStatus.ACCEPTED },
      {
        onError: (error: any) => {
          const message =
            error?.response?.data?.message || "Failed to accept lead";
          Alert.alert("Error", message);
        },
      }
    );
  };

  const handleDecline = () => {
    if (status !== "pending") {
      Alert.alert(
        "Cannot Decline",
        "This lead cannot be declined. Only pending leads can be declined."
      );
      return;
    }
    acceptDeclineLead(
      { id: leadId, status: LeadStatus.DECLINED },
      {
        onError: (error: any) => {
          const message =
            error?.response?.data?.message || "Failed to decline lead";
          Alert.alert("Error", message);
        },
      }
    );
  };

  const handleOpenCompleteModal = () => {
    setIsCompleteModalVisible(true);
  };

  const handleCloseCompleteModal = () => {
    setIsCompleteModalVisible(false);
    onComplete?.();
  };

  // Render accept/decline buttons only for pending leads
  const renderAcceptDeclineButtons = () => {
    if (status !== "pending") return null;

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.button, styles.acceptButton]}
          onPress={handleAccept}
          disabled={isAcceptDeclinePending}
          activeOpacity={0.7}
        >
          <ThemedText style={styles.buttonText}>
            {isAcceptDeclinePending ? "Accepting..." : "Accept"}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.declineButton]}
          onPress={handleDecline}
          disabled={isAcceptDeclinePending}
          activeOpacity={0.7}
        >
          <ThemedText style={styles.buttonText}>
            {isAcceptDeclinePending ? "Declining..." : "Decline"}
          </ThemedText>
        </TouchableOpacity>
      </View>
    );
  };

  // Render complete button only for accepted leads
  const renderCompleteButton = () => {
    if (status !== "accepted") return null;

    return (
      <View style={styles.actionContainer}>
        <View style={styles.actionHeader}>
          <ThemedText type="subtitle" style={styles.actionTitle}>
            Complete Lead
          </ThemedText>
        </View>
        <TouchableOpacity
          style={[styles.button, styles.completeButton]}
          onPress={handleOpenCompleteModal}
          activeOpacity={0.7}
        >
          <ThemedText style={styles.buttonText}>Complete</ThemedText>
        </TouchableOpacity>
      </View>
    );
  };

  // Show message for completed or declined leads
  if (status === "completed") {
    return (
      <View style={styles.statusMessageContainer}>
        <ThemedText style={styles.statusMessage}>
          ✓ This lead has been completed
        </ThemedText>
      </View>
    );
  }

  if (status === "declined") {
    return (
      <View style={styles.statusMessageContainer}>
        <ThemedText style={styles.statusMessage}>
          This lead has been declined
        </ThemedText>
      </View>
    );
  }

  return (
    <>
      {renderAcceptDeclineButtons()}
      {renderCompleteButton()}
      <CompleteLeadModal
        visible={isCompleteModalVisible}
        onClose={handleCloseCompleteModal}
        leadId={leadId}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  actionContainer: {
    marginTop: 16,
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
  actionHeader: {
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "#10b981",
    flex: 1,
  },
  declineButton: {
    backgroundColor: "#ef4444",
    flex: 1,
  },
  completeButton: {
    backgroundColor: "#3b82f6",
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  statusMessageContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#f0f9ff",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },
  statusMessage: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e40af",
    textAlign: "center",
  },
});
