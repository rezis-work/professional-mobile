import { ScreenHeader } from "@/components/ScreenHeader";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScreenHeader
        title={
          selectedCityId && selectedCity
            ? `${selectedCity.name} Areas`
            : "Unlock Cities"
        }
        showBack={!!selectedCityId}
        onBack={onBack}
      />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {selectedCityId && selectedCity ? (
          <View className="gap-6">
            {/* City Info Card */}
            <View className="bg-blue-50 dark:bg-blue-900/30 rounded-2xl p-5 border border-blue-200 dark:border-blue-800">
              <View className="flex-row items-center">
                <View className="bg-blue-600 dark:bg-blue-500 rounded-full p-3 mr-4">
                  <Ionicons name="location" size={24} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1 uppercase tracking-wide">
                    Selected City
                  </Text>
                  <Text className="text-xl font-bold text-text">
                    {selectedCity.name}
                  </Text>
                </View>
              </View>
            </View>

            {isCityPartLoading ? (
              <UnlockSkeleton />
            ) : isCityPartError ? (
              <UnlockError
                message={`Failed to load areas for ${selectedCity.name}`}
              />
            ) : cityParts.length === 0 ? (
              <View className="items-center justify-center py-16">
                <View className="bg-gray-100 dark:bg-neutral-800 rounded-full p-6 mb-4">
                  <Ionicons name="location-outline" size={56} color="#9ca3af" />
                </View>
                <Text className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                  No Areas Available
                </Text>
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
          <View className="gap-6">
            {/* Subtitle */}
            <View className="mb-2">
              <Text className="text-base text-gray-600 dark:text-gray-400 leading-6">
                Select a city to view and unlock available areas
              </Text>
            </View>
            <CitiesGrid cities={cities} onCityPress={onCityPress} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
