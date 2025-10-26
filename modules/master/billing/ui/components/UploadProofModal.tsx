import { useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { useUploadProof } from "../../hooks/use-upload-proof";
import * as ImagePicker from "expo-image-picker";

interface UploadProofModalProps {
  visible: boolean;
  onClose: () => void;
  billingId: string;
}

export function UploadProofModal({
  visible,
  onClose,
  billingId,
}: UploadProofModalProps) {
  const [proofNote, setProofNote] = useState("");
  const [selectedImage, setSelectedImage] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);
  const { mutate: uploadProof, isPending } = useUploadProof();

  const handlePickImage = async () => {
    try {
      console.log("Requesting permissions...");
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log("Permission status:", status);

      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Please grant permission to access your photos"
        );
        return;
      }

      console.log("Launching image library...");
      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 0.8,
        allowsEditing: true,
        selectionLimit: 1,
      });
      console.log("Image picker result:", result);

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const name = asset.fileName || `photo_${Date.now()}.jpg`;
        const type = asset.mimeType || "image/jpeg";
        console.log("Setting image:", { uri: asset.uri, name, type });
        setSelectedImage({ uri: asset.uri, name, type });
      }
    } catch (error) {
      console.error("Error in handlePickImage:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const handleUpload = async () => {
    if (!proofNote.trim()) {
      Alert.alert("Error", "Please enter a proof note");
      return;
    }

    if (proofNote.trim().length < 10) {
      Alert.alert("Error", "Proof note must be at least 10 characters long");
      return;
    }

    if (!selectedImage) {
      Alert.alert("Error", "Please select an image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("billingLogId", billingId);
      formData.append("proofNote", proofNote);

      // @ts-ignore react-native file
      formData.append("image", {
        uri: selectedImage.uri,
        name: selectedImage.name,
        type: selectedImage.type,
      } as any);

      uploadProof(formData, {
        onSuccess: () => {
          setProofNote("");
          setSelectedImage(null);
          onClose();
        },
      });
    } catch (error) {
      console.error("Error uploading proof:", error);
      Alert.alert("Error", "Failed to upload proof. Please try again.");
    }
  };

  const handleClose = () => {
    if (!isPending) {
      setProofNote("");
      setSelectedImage(null);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ThemedText style={styles.modalTitle}>Upload Proof</ThemedText>

          <View style={styles.inputSection}>
            <ThemedText style={styles.label}>Proof Note</ThemedText>
            <TextInput
              style={styles.textInput}
              placeholder="Enter proof note"
              placeholderTextColor="#9ca3af"
              value={proofNote}
              onChangeText={setProofNote}
              multiline
              numberOfLines={4}
              editable={!isPending}
            />
          </View>

          <View style={styles.imageSection}>
            <ThemedText style={styles.label}>Proof Image</ThemedText>
            {selectedImage ? (
              <View>
                <Image
                  source={{ uri: selectedImage.uri }}
                  style={{ width: "100%", height: 200, borderRadius: 8 }}
                />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => setSelectedImage(null)}
                  disabled={isPending}
                >
                  <ThemedText style={styles.removeButtonText}>
                    Remove
                  </ThemedText>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.selectButton}
                onPress={handlePickImage}
                disabled={isPending}
              >
                <ThemedText style={styles.selectButtonText}>
                  Select Image
                </ThemedText>
              </TouchableOpacity>
            )}
            <ThemedText style={styles.hint}>
              JPG, PNG, SVG or JPEG, max 1mb
            </ThemedText>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              disabled={isPending}
            >
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.uploadButton,
                isPending && styles.uploadButtonDisabled,
              ]}
              onPress={handleUpload}
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.uploadButtonText}>
                  Upload Proof
                </ThemedText>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 32,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
    backgroundColor: "#f9fafb",
  },
  imageSection: {
    marginBottom: 24,
  },
  selectButton: {
    borderWidth: 2,
    borderColor: "#3b82f6",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    backgroundColor: "#eff6ff",
    marginBottom: 8,
  },
  selectButtonText: {
    color: "#3b82f6",
    fontSize: 16,
    fontWeight: "600",
  },
  removeButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#ef4444",
    borderRadius: 6,
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  hint: {
    fontSize: 12,
    opacity: 0.6,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cancelButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
  uploadButton: {
    backgroundColor: "#3b82f6",
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
