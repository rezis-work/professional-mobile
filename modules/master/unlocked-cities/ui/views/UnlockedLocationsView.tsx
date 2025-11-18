import {
  ScrollView,
  View,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { useGetUnlockedMasterLocations } from "../../hooks/useGetUnlockedMasterLocations";
import { useDeleteUnlockedLocation } from "../../hooks/useDeleteUnlockedLocation";
import type { UnlockedCity } from "../../types";
import {
  UnlockedSkeleton,
  UnlockedError,
  UnlockedNoData,
} from "../components/States";
import { UnlockedCard } from "../components/UnlockedCard";
import { useTranslation } from "react-i18next";
import { useThemeColorPalette } from "@/hooks/use-theme-color-palette";
import { useColorScheme } from "@/hooks/use-color-scheme";


export function UnlockedLocationsView() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = useThemeColorPalette();

  const { data, isLoading, isError, error } = useGetUnlockedMasterLocations();
  const { mutate: deleteUnlockedLocation, isPending } =
    useDeleteUnlockedLocation();

  const unlockedCities: UnlockedCity[] = data?.data || [];

  if (isLoading) return <UnlockedSkeleton />;
  if (isError) return <UnlockedError message={(error as any)?.message} />;
  if (unlockedCities.length === 0) return <UnlockedNoData />;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title} numberOfLines={1}>
          {t("masterNavigation.unlockedCities")}
        </ThemedText>
        <ThemedText style={styles.subtitle} numberOfLines={1}>
          {unlockedCities.length}{" "}
          {unlockedCities.length === 1 ? "city unlocked" : "cities unlocked"}
        </ThemedText>
      </View>

      {/* Cities Grid */}
      <View style={styles.grid}>
        {unlockedCities.map((city) => {
          const unlockedDate = new Date(city.unlockedAt).toLocaleDateString();
          return (
            <UnlockedCard
              key={city.cityPartId}
              city={city}
              isPending={isPending}
              onRemove={deleteUnlockedLocation}
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
  header: {
    marginBottom: 12,
    gap: 4,
    flexShrink: 1,
  },
  title: {
    marginBottom: 0,
    flexShrink: 1,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    flexShrink: 1,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    alignItems: "flex-start",
  },
});
