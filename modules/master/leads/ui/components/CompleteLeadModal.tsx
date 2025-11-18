import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useToast } from "@/components/toast";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColorPalette } from "@/hooks/use-theme-color-palette";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useCompleteLead } from "../../hooks/use-complete-lead";

interface CompleteLeadModalProps {
  visible: boolean;
  onClose: () => void;
  leadId: string;
}

export function CompleteLeadModal({
  visible,
  onClose,
  leadId,
}: CompleteLeadModalProps) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const colors = useThemeColorPalette();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [price, setPrice] = useState("");
  const { mutate: completeLead, isPending } = useCompleteLead();

  const handleSubmit = () => {
    const priceNumber = Number(price);
    if (!price || isNaN(priceNumber) || priceNumber <= 0) {
      return;
    }

    completeLead(
      { leadId, price: priceNumber },
      {
        onSuccess: () => {
          setPrice("");
          onClose();
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.message || t("leads.failedToComplete");
          showToast(message, "error");
        },
      }
    );
  };

  const handleClose = () => {
    setPrice("");
    onClose();
  };

  const isValidPrice = price && !isNaN(Number(price)) && Number(price) > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <ThemedView style={styles.modalContent}>
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              {t("leads.completeLead")}
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              {t("leads.enterFinalPrice")}
            </ThemedText>
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>{t("leads.price")}</ThemedText>
            <View
              style={[
                styles.inputWrapper,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.secondaryBackground,
                },
              ]}
            >
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="0.00"
                placeholderTextColor={colors.mutedIcon}
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
                autoFocus
              />
              <ThemedText
                style={[styles.currency, { color: colors.mutedIcon }]}
              >
                ₾
              </ThemedText>
            </View>
            {price && !isValidPrice && (
              <ThemedText style={[styles.errorText, { color: colors.error }]}>
                {t("leads.invalidPrice")}
              </ThemedText>
            )}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.cancelButton,
                { backgroundColor: colors.secondaryBackground },
              ]}
              onPress={handleClose}
              disabled={isPending}
              activeOpacity={0.7}
            >
              <ThemedText
                style={[styles.cancelButtonText, { color: colors.mutedIcon }]}
              >
                {t("common.cancel")}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.submitButton,
                {
                  backgroundColor:
                    !isValidPrice || isPending
                      ? colors.mutedIcon
                      : colors.primary,
                },
                (!isValidPrice || isPending) && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isPending || !isValidPrice}
              activeOpacity={0.7}
            >
              <ThemedText
                style={[styles.submitButtonText, { color: colors.white }]}
              >
                {isPending ? t("leads.completing") : t("leads.completeLead")}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "600",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 12,
    overflow: "hidden",
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 18,
    fontWeight: "600",
  },
  currency: {
    fontSize: 18,
    fontWeight: "600",
    paddingRight: 16,
  },
  errorText: {
    fontSize: 14,
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {},
  submitButton: {},
  submitButtonDisabled: {
    opacity: 0.6,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
