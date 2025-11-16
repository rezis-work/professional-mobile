import { ScreenHeader } from "@/components/ScreenHeader";
import { useAuth } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMasterProfileById } from "../../hooks/useMasterProfileById";
import { useUpdateAvailability } from "../../hooks/useUpdateAvailability";
import { useUpsertProfile } from "../../hooks/useUpsertProfile";
import { profileSchema, type ProfileFormValues } from "../../schema";
import { AvailabilityButtons } from "../components/AvailabilityButtons";
import { BioInput } from "../components/BioInput";
import { CityInput } from "../components/CityInput";
import { ImagePickerInput } from "../components/ImagePickerInput";

export function MasterSettingsView() {
  const { user } = useAuth();
  const { t } = useTranslation();
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
        Alert.alert(t("common.success"), t("common.profileUpdated"));
        setValue("bio", "");
        setValue("city", "");
        setValue("image", null);
      },
      onError: (e: any) =>
        Alert.alert(
          t("common.error"),
          e?.response?.data?.message || t("common.updateFailed")
        ),
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScreenHeader title={t("masterNavigation.profileSettings")} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24, paddingTop: 16 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-5">
          <CityInput setValue={setValue as any} error={errors.city?.message} />
          <BioInput setValue={setValue as any} error={errors.bio?.message} />
          <ImagePickerInput
            setValue={setValue as any}
            uri={watch("image")?.uri}
          />

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={upserting || isSubmitting}
            // 👈 style -> className (p-3.5 = 14px, rounded-lg = 8px)
            className="bg-[#2D5BE3] p-3.5 rounded-lg items-center"
          >
            {/* 👈 ThemedText -> Text, style -> className */}
            <Text className="text-white font-sans">
              {upserting ? t("common.saving") : t("common.saveProfile")}
            </Text>
          </TouchableOpacity>

          {/* 👈 გამყოფი ხაზი NativeWind-ზე, თემის მხარდაჭერით */}
          <View className="h-px bg-neutral-200 dark:bg-neutral-700 my-2.5" />

          <AvailabilityButtons
            value={selectedAvailability}
            onSelect={(key) => {
              setSelectedAvailability(key);
              updAvail(key);
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
