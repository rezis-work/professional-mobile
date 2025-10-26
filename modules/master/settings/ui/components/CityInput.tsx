import { ThemedText } from "@/components/themed-text";
import { TextInput, View } from "react-native";
import type { UseFormSetValue } from "react-hook-form";
import type { ProfileFormValues } from "../../schema";
import { useTranslation } from "react-i18next";

export function CityInput({
  setValue,
  error,
}: {
  setValue: UseFormSetValue<ProfileFormValues>;
  error?: string;
}) {
  const { t } = useTranslation();

  return (
    <View style={{ gap: 8 }}>
      <ThemedText>{t("settings.city")}</ThemedText>
      <TextInput
        placeholder={t("settings.enterCity")}
        onChangeText={(t) => setValue("city", t, { shouldValidate: true })}
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          padding: 10,
          borderRadius: 8,
        }}
      />
      {error ? (
        <ThemedText style={{ color: "#ef4444" }}>{error}</ThemedText>
      ) : null}
    </View>
  );
}
