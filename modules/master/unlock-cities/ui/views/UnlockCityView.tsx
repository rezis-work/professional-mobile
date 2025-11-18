import { ThemedText } from "@/components/themed-text";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColorPalette } from "@/hooks/use-theme-color-palette";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useGetCities } from "../../hooks/useGetCities";
import { useGetCityPart } from "../../hooks/useGetCityPart";
import { useUnlockCity } from "../../hooks/useUnlockCity";
import type { City, CityPart } from "../../types";
import { CitiesGrid } from "../components/CitiesGrid";
import { CityPartsGrid } from "../components/CityPartsGrid";
import {
  UnlockError,
  UnlockNoData,
  UnlockSkeleton,
} from "../components/States";

export function UnlockCityView() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = useThemeColorPalette();

  const { data, isLoading, isError, error } = useGetCities();
  const { mutate: unlockCityMutation, isPending: isUnlockingCity } =
    useUnlockCity();
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [unlockingPartId, setUnlockingPartId] = useState<string | null>(null);
  const {
    data: cityPartData,
    isLoading: isCityPartLoading,
    isError: isCityPartError,
  } = useGetCityPart(selectedCityId || "");

  const cities: City[] = data?.data || [];
  const cityParts: CityPart[] = cityPartData?.data || [];
  const selectedCity = selectedCityId
    ? cities.find((c) => c.id === selectedCityId)
    : null;

  const onCityPress = (cityId: string) => setSelectedCityId(cityId);
  const onBack = () => setSelectedCityId(null);

  const handleUnlockCityPart = (part: CityPart) => {
    if (!selectedCityId) return;
    setUnlockingPartId(part.id);
    unlockCityMutation(
      { locationId: part.id, cityId: selectedCityId, cityPartId: part.id },
      { onSettled: () => setUnlockingPartId(null) }
    );
  };

  if (isLoading) return <UnlockSkeleton />;
  if (isError) return <UnlockError message={(error as any)?.message} />;
  if (!cities || cities.length === 0) return <UnlockNoData />;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        {selectedCityId && selectedCity && (
          <TouchableOpacity
            onPress={onBack}
            style={[
              styles.backButton,
              { backgroundColor: `${colors.primary}1A` },
            ]}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color={colors.primary} />
          </TouchableOpacity>
        )}
        <ThemedText type="title" style={styles.title}>
          {selectedCityId && selectedCity
            ? `${selectedCity.name} Areas`
            : t("masterNavigation.unlockCities")}
        </ThemedText>
      </View>

      {/* Content */}
      {selectedCityId && selectedCity ? (
        <View>
          {isCityPartLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <ThemedText style={styles.loadingText}>
                Loading areas...
              </ThemedText>
            </View>
          ) : isCityPartError ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={32} color={colors.error} />
              <ThemedText style={[styles.errorText, { color: colors.error }]}>
                Failed to load areas for {selectedCity.name}
              </ThemedText>
            </View>
          ) : cityParts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="location-outline"
                size={32}
                color={colors.mutedIcon}
              />
              <ThemedText style={styles.emptyText}>
                No Areas Available
              </ThemedText>
            </View>
          ) : (
            <CityPartsGrid
              parts={cityParts}
              onUnlock={handleUnlockCityPart}
              unlockingPartId={unlockingPartId}
            />
          )}
        </View>
      ) : (
        <CitiesGrid cities={cities} onCityPress={onCityPress} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 12,
  },
  loadingText: {
    opacity: 0.7,
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 12,
  },
  errorText: {
    textAlign: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 12,
  },
  emptyText: {
    opacity: 0.7,
    textAlign: "center",
  },
});
