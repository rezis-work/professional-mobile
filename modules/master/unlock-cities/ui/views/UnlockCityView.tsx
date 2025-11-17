import { useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { useGetCities } from "../../hooks/useGetCities";
import { useGetCityPart } from "../../hooks/useGetCityPart";
import { useUnlockCity } from "../../hooks/useUnlockCity";
import { CitiesGrid } from "../components/CitiesGrid";
import { CityPartsGrid } from "../components/CityPartsGrid";
import {
  UnlockError,
  UnlockNoData,
  UnlockSkeleton,
} from "../components/States";
import type { City, CityPart } from "../../types";
import { useTranslation } from "react-i18next";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";

export function UnlockCityView() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const backgroundColor = useThemeColor(
    { light: "#F3F4F6", dark: "#000000" },
    "background"
  );
  const tint = useThemeColor(
    { light: "#3B82F6", dark: "#2563EB" },
    "tint"
  );

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
      style={{ flex: 1, backgroundColor }}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        {selectedCityId && selectedCity && (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color={tint} />
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
              <ActivityIndicator size="large" color={tint} />
              <ThemedText style={styles.loadingText}>
                Loading areas...
              </ThemedText>
            </View>
          ) : isCityPartError ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={32} color="#EF4444" />
              <ThemedText style={styles.errorText}>
                Failed to load areas for {selectedCity.name}
              </ThemedText>
            </View>
          ) : cityParts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="location-outline" size={32} color="#9CA3AF" />
              <ThemedText style={styles.emptyText}>No Areas Available</ThemedText>
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
    backgroundColor: "rgba(59, 130, 246, 0.1)",
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
    color: "#EF4444",
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
