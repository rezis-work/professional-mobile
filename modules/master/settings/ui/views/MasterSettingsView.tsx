import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemedText } from "@/components/themed-text";
import { useToast } from "@/components/toast";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColorPalette } from "@/hooks/use-theme-color-palette";
import { useAuth } from "@/lib/auth";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
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
        showToast(t("common.profileUpdated"), "success");
        setValue("bio", "");
        setValue("city", "");
        setValue("image", null);
      },
      onError: (e: any) =>
        showToast(
          e?.response?.data?.message || t("common.updateFailed"),
          "error"
        ),
    });
  };

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = useThemeColorPalette();
  const { showToast } = useToast();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.scrollContent,
        Platform.OS === "ios" && { paddingBottom: 100 },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Settings Card */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.cardBackground },
          isDark && [styles.cardDark, { borderColor: colors.border }],
        ]}
      >
        <CityInput
          setValue={setValue as any}
          error={errors.city?.message}
          defaultValue={watch("city")}
        />
        <BioInput
          setValue={setValue as any}
          error={errors.bio?.message}
          defaultValue={watch("bio")}
        />
        <ImagePickerInput
          setValue={setValue as any}
          uri={watch("image")?.uri}
        />

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={upserting || isSubmitting}
          style={[
            styles.saveButton,
            { backgroundColor: colors.primary },
            (upserting || isSubmitting) && styles.saveButtonDisabled,
          ]}
          activeOpacity={0.7}
        >
          {upserting || isSubmitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={colors.white}
              />
              <ThemedText
                style={styles.saveButtonText}
                lightColor={colors.white}
                darkColor={colors.white}
              >
                {t("common.saveProfile")}
              </ThemedText>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Availability Card */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.cardBackground },
          isDark && [styles.cardDark, { borderColor: colors.border }],
        ]}
      >
        <View style={styles.sectionHeader}>
          <Ionicons name="time" size={20} color={colors.primary} />
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {t("settings.availability")}
          </ThemedText>
          {updatingAvail && (
            <ActivityIndicator
              size="small"
              color={colors.primary}
              style={{ marginLeft: 8 }}
            />
          )}
        </View>
        <AvailabilityButtons
          value={selectedAvailability}
          onSelect={(key) => {
            setSelectedAvailability(key);
            updAvail(key);
          }}
        />
      </View>

      {/* Language Card */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.cardBackground },
          isDark && [styles.cardDark, { borderColor: colors.border }],
        ]}
      >
        <View style={styles.sectionHeader}>
          <Ionicons name="language" size={20} color={colors.primary} />
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {t("common.language")}
          </ThemedText>
        </View>
        <LanguageSwitcher />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    gap: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardDark: {
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontWeight: "600",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
