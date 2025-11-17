import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import {
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";
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
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";

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

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const cardBg = useThemeColor(
    { light: "#FFFFFF", dark: "#1F2937" },
    "background"
  );
  const backgroundColor = useThemeColor({}, "background");
  const tint = useThemeColor(
    { light: "#3B82F6", dark: "#2563EB" },
    "tint"
  );
  const borderColor = useThemeColor(
    { light: "#E5E7EB", dark: "#374151" },
    "text"
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor }}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Settings Card */}
      <View
        style={[
          styles.card,
          { backgroundColor: cardBg },
          isDark && styles.cardDark,
        ]}
      >
        <View style={styles.sectionHeader}>
          <Ionicons name="person" size={20} color={tint} />
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {t("masterNavigation.profileSettings")}
          </ThemedText>
        </View>

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
            { backgroundColor: tint },
            (upserting || isSubmitting) && styles.saveButtonDisabled,
          ]}
          activeOpacity={0.7}
        >
          {upserting || isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
              <ThemedText style={styles.saveButtonText} lightColor="#FFFFFF" darkColor="#FFFFFF">
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
          { backgroundColor: cardBg },
          isDark && styles.cardDark,
        ]}
      >
        <View style={styles.sectionHeader}>
          <Ionicons name="time" size={20} color={tint} />
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {t("settings.availability")}
          </ThemedText>
        </View>
        <AvailabilityButtons
          value={selectedAvailability}
          onSelect={(key) => {
            setSelectedAvailability(key);
            updAvail(key);
          }}
        />
        {updatingAvail && (
          <View style={styles.loadingIndicator}>
            <ActivityIndicator size="small" color={tint} />
          </View>
        )}
      </View>

      {/* Language Card */}
      <View
        style={[
          styles.card,
          { backgroundColor: cardBg },
          isDark && styles.cardDark,
        ]}
      >
        <View style={styles.sectionHeader}>
          <Ionicons name="language" size={20} color={tint} />
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
    borderColor: "#374151",
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
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingIndicator: {
    alignItems: "center",
    paddingTop: 8,
  },
});
