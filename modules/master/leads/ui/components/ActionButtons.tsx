import { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { useAcceptDeclineLead } from "../../hooks/use-accept-decline-lead";
import { LeadStatus } from "../../types";
import { CompleteLeadModal } from "./CompleteLeadModal";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/toast";

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
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { mutate: acceptDeclineLead, isPending: isAcceptDeclinePending } =
    useAcceptDeclineLead();
  const [isCompleteModalVisible, setIsCompleteModalVisible] = useState(false);

  const handleAccept = () => {
    if (status !== "pending") {
      showToast(t("leads.cannotAcceptDescription"), "warning");
      return;
    }
    acceptDeclineLead(
      { id: leadId, status: LeadStatus.ACCEPTED },
      {
        onError: (error: any) => {
          const message =
            error?.response?.data?.message || t("leads.failedToAccept");
          showToast(message, "error");
        },
      }
    );
  };

  const handleDecline = () => {
    if (status !== "pending") {
      showToast(t("leads.cannotDeclineDescription"), "warning");
      return;
    }
    acceptDeclineLead(
      { id: leadId, status: LeadStatus.DECLINED },
      {
        onError: (error: any) => {
          const message =
            error?.response?.data?.message || t("leads.failedToDecline");
          showToast(message, "error");
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
            {isAcceptDeclinePending ? t("leads.accepting") : t("common.accept")}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.declineButton]}
          onPress={handleDecline}
          disabled={isAcceptDeclinePending}
          activeOpacity={0.7}
        >
          <ThemedText style={styles.buttonText}>
            {isAcceptDeclinePending
              ? t("leads.declining")
              : t("common.decline")}
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
            {t("leads.completeLead")}
          </ThemedText>
        </View>
        <TouchableOpacity
          style={[styles.button, styles.completeButton]}
          onPress={handleOpenCompleteModal}
          activeOpacity={0.7}
        >
          <ThemedText style={styles.buttonText}>
            {t("common.complete")}
          </ThemedText>
        </TouchableOpacity>
      </View>
    );
  };

  // Show message for completed or declined leads
  if (status === "completed") {
    return (
      <View style={styles.statusMessageContainer}>
        <ThemedText style={styles.statusMessage}>
          ✓ {t("leads.leadCompleted")}
        </ThemedText>
      </View>
    );
  }

  if (status === "declined") {
    return (
      <View style={styles.statusMessageContainer}>
        <ThemedText style={styles.statusMessage}>
          {t("leads.leadDeclined")}
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
