import { TextInput, View, Text } from "react-native";
import type { UseFormSetValue } from "react-hook-form";
import type { ProfileFormValues } from "../../schema";
import { useTranslation } from "react-i18next";
import { Feather } from "@expo/vector-icons"; // 👈 დავამატე იკონკა

export function BioInput({
  setValue,
  error,
}: {
  setValue: UseFormSetValue<ProfileFormValues>;
  error?: string;
}) {
  const { t } = useTranslation();

  return (
    <View className="gap-2">
      <Text className="text-base font-medium text-text font-sans">
        {t("profile.bio")}
      </Text>
      {/* 👈 ახალი, იკონკიანი ინფუთის დიზაინი */}
      <View
        className={`
          flex-row border bg-input-background rounded-xl
          ${error ? "border-red-500" : "border-input-border"}
        `}
      >
        <Feather name="align-left" size={20} color="#9ca3af" className="mx-3 mt-3.5" />
        <TextInput
          placeholder={t("settings.enterBio")}
          placeholderTextColor="#9ca3af"
          multiline
          onChangeText={(t) => setValue("bio", t, { shouldValidate: true })}
          className="flex-1 py-3 pr-3 text-text font-sans text-base min-h-[120px]"
          style={{ textAlignVertical: "top" }}
        />
      </View>
      {error ? (
        <Text className="text-red-500 text-sm font-sans mt-1">{error}</Text>
      ) : null}
    </View>
  );
}