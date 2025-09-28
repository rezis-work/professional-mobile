import { ThemedText } from "@/components/themed-text";
import { TextInput, View } from "react-native";
import type { UseFormSetValue } from "react-hook-form";
import type { ProfileFormValues } from "../../schema";

export function CityInput({
  setValue,
  error,
}: {
  setValue: UseFormSetValue<ProfileFormValues>;
  error?: string;
}) {
  return (
    <View style={{ gap: 8 }}>
      <ThemedText>City</ThemedText>
      <TextInput
        placeholder="City"
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
