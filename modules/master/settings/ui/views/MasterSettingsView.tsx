import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { TouchableOpacity, View, Alert, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  availabilitySchema,
  profileSchema,
  type ProfileFormValues,
  type AvailabilityFormValues,
} from "../../schema";
import { useUpsertProfile } from "../../hooks/useUpsertProfile";
import { useUpdateAvailability } from "../../hooks/useUpdateAvailability";
import { useAuth } from "@/lib/auth";
import { useMasterProfileById } from "../../hooks/useMasterProfileById";
import { CityInput } from "../components/CityInput";
import { BioInput } from "../components/BioInput";
import { ImagePickerInput } from "../components/ImagePickerInput";
import { AvailabilityButtons } from "../components/AvailabilityButtons";

export function MasterSettingsView() {
  const { user } = useAuth();
  const userId = user?.id ?? "";
  const { data: profile } = useMasterProfileById(userId);
  const [selectedAvailability, setSelectedAvailability] = useState<
    "now" | "tomorrow" | "next_week" | "on_holiday"
  >("now");

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { bio: "", city: "", image: null },
  });

  const { mutate: upsert, isPending: upserting } = useUpsertProfile(userId);
  const { mutate: updAvail, isPending: updatingAvail } =
    useUpdateAvailability(userId);

  useEffect(() => {
    if (profile) {
      const p: any = profile;
      setValue("city", p?.city ?? "");
      setValue("bio", p?.bio ?? "");
      if (p?.availability) setSelectedAvailability(p.availability);
    }
  }, [profile, setValue]);

  const onSubmit = (data: ProfileFormValues) => {
    upsert(data, {
      onSuccess: () => {
        Alert.alert("Saved", "Profile updated successfully");
        setValue("bio", "");
        setValue("city", "");
        setValue("image", null);
      },
      onError: (e: any) =>
        Alert.alert(
          "Error",
          e?.response?.data?.message || "Failed to update profile"
        ),
    });
  };

  return (
    <ScrollView
      contentContainerStyle={{ padding: 16 }}
      keyboardShouldPersistTaps="handled"
    >
      <ThemedView style={{ gap: 20 }}>
        <ThemedText type="title">Profile Settings</ThemedText>

        <CityInput setValue={setValue as any} error={errors.city?.message} />
        <BioInput setValue={setValue as any} error={errors.bio?.message} />
        <ImagePickerInput
          setValue={setValue as any}
          uri={watch("image")?.uri}
        />

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={upserting || isSubmitting}
          style={{
            backgroundColor: "#2D5BE3",
            padding: 14,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <ThemedText style={{ color: "white" }}>
            {upserting ? "Saving..." : "Save Profile"}
          </ThemedText>
        </TouchableOpacity>

        <View
          style={{ height: 1, backgroundColor: "#eee", marginVertical: 10 }}
        />

        <AvailabilityButtons
          value={selectedAvailability}
          onSelect={(key) => {
            setSelectedAvailability(key);
            updAvail(key);
          }}
        />
      </ThemedView>
    </ScrollView>
  );
}
