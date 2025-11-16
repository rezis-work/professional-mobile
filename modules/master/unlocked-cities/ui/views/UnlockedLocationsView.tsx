import { ScreenHeader } from "@/components/ScreenHeader";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
  const { data, isLoading, isError, error } = useGetUnlockedMasterLocations();
  const { mutate: deleteUnlockedLocation, isPending } =
    useDeleteUnlockedLocation();

  const unlockedCities: UnlockedCity[] = data?.data || [];

  if (isLoading) return <UnlockedSkeleton />;
  if (isError) return <UnlockedError message={(error as any)?.message} />;
  if (unlockedCities.length === 0) return <UnlockedNoData />;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScreenHeader title={t("masterNavigation.unlockedCities")} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Bar */}
        <View className="mb-5">
          <View className="bg-white dark:bg-neutral-800 rounded-2xl p-4 border border-gray-200 dark:border-neutral-700">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-2.5 mr-3">
                  <Ionicons name="location" size={20} color="#2563eb" />
                </View>
                <View>
                  <Text className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                    Unlocked Locations
                  </Text>
                  <Text className="text-2xl font-bold text-text">
                    {unlockedCities.length}
                  </Text>
                </View>
              </View>
              <View className="bg-gray-100 dark:bg-neutral-700 rounded-full px-3 py-1.5">
                <Text className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  {unlockedCities.filter((c) => c.isActive).length} Active
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Cities Grid */}
        <View
          className="flex-row flex-wrap gap-4"
          style={{ alignItems: "stretch" }}
        >
          {unlockedCities.map((city) => {
            const unlockedDate = new Date(city.unlockedAt).toLocaleDateString();
            return (
              <View
                key={city.cityPartId}
                className="w-[48%]"
                style={{ alignSelf: "stretch" }}
              >
                <UnlockedCard
                  city={city}
                  isPending={isPending}
                  onRemove={deleteUnlockedLocation}
                  unlockedDate={unlockedDate}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
