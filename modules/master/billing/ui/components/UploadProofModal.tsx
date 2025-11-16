import { useState } from "react";
import {
  Modal,
  View,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  Image,
  Text,
  ScrollView,
} from "react-native";
import { useUploadProof } from "../../hooks/use-upload-proof";
import * as ImagePicker from "expo-image-picker";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

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
  const { t } = useTranslation();
  const [proofNote, setProofNote] = useState("");
  const [selectedImage, setSelectedImage] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);
  const { mutate: uploadProof, isPending } = useUploadProof();

  const handlePickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          t("settings.permissionRequired"),
          t("settings.permissionRequired")
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 0.8,
        allowsEditing: true,
        selectionLimit: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const name = asset.fileName || `photo_${Date.now()}.jpg`;
        const type = asset.mimeType || "image/jpeg";
        setSelectedImage({ uri: asset.uri, name, type });
      }
    } catch (error) {
      console.error("Error in handlePickImage:", error);
      Alert.alert(t("common.error"), t("billing.failedToPickImage"));
    }
  };

  const handleUpload = async () => {
    if (!proofNote.trim()) {
      Alert.alert(t("common.error"), t("billing.noteRequired"));
      return;
    }

    if (proofNote.trim().length < 10) {
      Alert.alert(t("common.error"), t("billing.invalidNoteLength"));
      return;
    }

    if (!selectedImage) {
      Alert.alert(t("common.error"), t("billing.imageRequired"));
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
      Alert.alert(t("common.error"), t("billing.uploadFailed"));
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
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white dark:bg-neutral-800 rounded-t-3xl p-6 max-h-[80%]">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("billing.uploadProof")}
            </Text>
            <Pressable
              onPress={handleClose}
              disabled={isPending}
              className="w-8 h-8 items-center justify-center"
            >
              <Ionicons name="close" size={24} color="#6b7280" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                {t("billing.proofNote")}
              </Text>
              <TextInput
                className="border border-gray-200 dark:border-neutral-700 rounded-xl p-3 text-base min-h-[100px] bg-gray-50 dark:bg-neutral-700/50 text-gray-900 dark:text-white"
                placeholder={t("billing.enterProofNote")}
                placeholderTextColor="#9ca3af"
                value={proofNote}
                onChangeText={setProofNote}
                multiline
                numberOfLines={4}
                editable={!isPending}
                textAlignVertical="top"
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                {t("billing.selectImage")}
              </Text>
              {selectedImage ? (
                <View>
                  <Image
                    source={{ uri: selectedImage.uri }}
                    className="w-full h-48 rounded-xl mb-2"
                    resizeMode="cover"
                  />
                  <Pressable
                    onPress={() => setSelectedImage(null)}
                    disabled={isPending}
                    className="self-start bg-red-500 px-3 py-1.5 rounded-lg"
                  >
                    <View className="flex-row items-center gap-2">
                      <Ionicons name="trash-outline" size={16} color="#fff" />
                      <Text className="text-white text-sm font-semibold">
                        {t("billing.remove")}
                      </Text>
                    </View>
                  </Pressable>
                </View>
              ) : (
                <Pressable
                  onPress={handlePickImage}
                  disabled={isPending}
                  className="border-2 border-blue-500 dark:border-blue-400 rounded-xl p-4 items-center bg-blue-50 dark:bg-blue-900/20 active:opacity-70"
                >
                  <Ionicons name="image-outline" size={32} color="#3b82f6" />
                  <Text className="text-blue-600 dark:text-blue-400 text-base font-semibold mt-2">
                    {t("billing.selectImage")}
                  </Text>
                </Pressable>
              )}
              <Text className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {t("billing.proofNoteHint")}
              </Text>
            </View>
          </ScrollView>

          <View className="flex-row gap-3 pt-4 border-t border-gray-200 dark:border-neutral-700">
            <Pressable
              onPress={handleClose}
              disabled={isPending}
              className="flex-1 bg-gray-100 dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 py-3.5 rounded-xl items-center active:opacity-70"
            >
              <Text className="text-gray-700 dark:text-gray-300 text-base font-semibold">
                {t("common.cancel")}
              </Text>
            </Pressable>
            <Pressable
              onPress={handleUpload}
              disabled={isPending}
              className={`flex-1 bg-blue-600 dark:bg-blue-700 py-3.5 rounded-xl items-center ${
                isPending ? "opacity-60" : "active:opacity-70"
              }`}
            >
              {isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View className="flex-row items-center gap-2">
                  <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
                  <Text className="text-white text-base font-semibold">
                    {t("billing.uploadProof")}
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
