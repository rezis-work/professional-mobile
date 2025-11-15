import { Feather } from "@expo/vector-icons"; // 👈 დავამატე იკონკა
import type { UseFormSetValue } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Text, TextInput, View } from "react-native";
import type { ProfileFormValues } from "../../schema";

export function CityInput({
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
        {t("settings.city")}
      </Text>
      {/* 👈 ახალი, იკონკიანი ინფუთის დიზაინი */}
      <View
        className={`
          flex-row items-center border bg-input-background rounded-xl
          ${error ? "border-red-500" : "border-input-border"}
        `}
      >
        <Feather name="map-pin" size={20} color="#9ca3af" className="mx-3" />
        <TextInput
          placeholder={t("settings.enterCity")}
          placeholderTextColor="#9ca3af"
          onChangeText={(t) => setValue("city", t, { shouldValidate: true })}
          className="flex-1 py-3 pr-3 text-text font-sans text-base"
        />
      </View>
      {error ? (
        <Text className="text-red-500 text-sm font-sans mt-1">{error}</Text>
      ) : null}
    </View>
  );
}
