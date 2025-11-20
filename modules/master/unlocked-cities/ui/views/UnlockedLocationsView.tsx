import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColorPalette } from "@/hooks/use-theme-color-palette";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { useDeleteUnlockedLocation } from "../../hooks/useDeleteUnlockedLocation";
import { useGetUnlockedMasterLocations } from "../../hooks/useGetUnlockedMasterLocations";
import type { UnlockedCity } from "../../types";
import {
  UnlockedError,
  UnlockedNoData,
  UnlockedSkeleton,
} from "../components/States";
import { UnlockedCard } from "../components/UnlockedCard";

export function UnlockedLocationsView() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = useThemeColorPalette();
  const [pendingCityPartId, setPendingCityPartId] = useState<string | null>(
    null
  );

  const { data, isLoading, isError, error } = useGetUnlockedMasterLocations();
  const { mutate: deleteUnlockedLocation } = useDeleteUnlockedLocation();

  const unlockedCities: UnlockedCity[] = data?.data || [];

  const handleRemove = (cityPartId: string) => {
    setPendingCityPartId(cityPartId);
    deleteUnlockedLocation(cityPartId, {
      onSettled: () => setPendingCityPartId(null),
    });
  };

  if (isLoading) return <UnlockedSkeleton />;
  if (isError) return <UnlockedError message={(error as any)?.message} />;
  if (unlockedCities.length === 0) return <UnlockedNoData />;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.scrollContent,
        Platform.OS === "ios" && { paddingBottom: 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Cities Grid */}
      <View style={styles.grid}>
        {unlockedCities.map((city) => {
          const unlockedDate = new Date(city.unlockedAt).toLocaleDateString();
          return (
            <UnlockedCard
              key={city.cityPartId}
              city={city}
              isPending={pendingCityPartId === city.cityPartId}
              onRemove={handleRemove}
              unlockedDate={unlockedDate}
            />
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    alignItems: "flex-start",
  },
});
