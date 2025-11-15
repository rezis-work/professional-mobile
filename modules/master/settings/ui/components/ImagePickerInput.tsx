import { TouchableOpacity, View, Image, Alert, Text } from "react-native";
import * as ExpoImagePicker from "expo-image-picker";
import type { UseFormSetValue } from "react-hook-form";
import type { ProfileFormValues } from "../../schema";
import { useTranslation } from "react-i18next";
import { Feather } from "@expo/vector-icons";

export function ImagePickerInput({
  setValue,
  uri,
}: {
  setValue: UseFormSetValue<ProfileFormValues>;
  uri?: string;
}) {
  const { t } = useTranslation();

  const pickImage = async () => {
    // ... (ფუნქციონალი უცვლელია)
    const { status } =
      await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(t("common.error"), t("settings.permissionRequired"));
      return;
    }
    const result = await ExpoImagePicker.launchImageLibraryAsync({
      quality: 0.8,
      allowsEditing: true,
      selectionLimit: 1,
      aspect: [1, 1],
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      const name = asset.fileName || `photo_${Date.now()}.jpg`;
      const type = asset.mimeType || "image/jpeg";
      setValue("image", { uri: asset.uri, name, type }, { shouldValidate: false });
    }
  };

  return (
    <View className="gap-2">
      <Text className="text-base font-medium text-text font-sans">
        {t("settings.profileImage")}
      </Text>
      <View className="flex-row items-center gap-4">
        {/* ავატარის პრევიუ */}
        <TouchableOpacity
          onPress={pickImage}
          className="w-24 h-24 rounded-full bg-input-background border border-input-border items-center justify-center overflow-hidden"
        >
          {uri ? (
            <Image source={{ uri }} className="w-24 h-24" />
          ) : (
            <Feather name="user" size={40} color="#9ca3af" />
          )}
        </TouchableOpacity>

        {/* ატვირთვის ღილაკი (ახალი, "დახვეწილი" დიზაინი) */}
        <TouchableOpacity
          onPress={pickImage}
          // 👇 ეს არის ახალი, თანამედროვე "მეორადი" ღილაკის სტილი
          className="flex-row items-center gap-2 rounded-lg py-2.5 px-4 bg-input-background border border-input-border"
        >
          {/* 👇 იკონკის ფერი ერგება თემას (text-icon ან უბრალოდ ნაცრისფერი) */}
          <Feather name="upload" size={16} color="#9ca3af" />
          {/* 👇 ტექსტის ფერიც ერგება თემას */}
          <Text className="text-text font-sans font-medium">
            {t("settings.pickImage")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}