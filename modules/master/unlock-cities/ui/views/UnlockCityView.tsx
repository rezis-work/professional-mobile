import { useState } from "react";
import { ScrollView, View } from "react-native";
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
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      {selectedCityId && selectedCity ? (
        <View style={{ gap: 16 }}>
          <ThemedText type="title">{selectedCity.name} Areas</ThemedText>
          {isCityPartLoading ? (
            <UnlockSkeleton />
          ) : isCityPartError ? (
            <UnlockError
              message={`Failed to load areas for ${selectedCity.name}`}
            />
          ) : cityParts.length === 0 ? (
            <ThemedText>No Areas Available</ThemedText>
          ) : (
            <CityPartsGrid
              parts={cityParts}
              onUnlock={handleUnlockCityPart}
              unlockingPartId={unlockingPartId}
            />
          )}
          <ThemedText onPress={onBack} style={{ color: "#2563eb" }}>
            ← Back to Cities
          </ThemedText>
        </View>
      ) : (
        <View style={{ gap: 16 }}>
          <ThemedText type="title">Unlock Cities</ThemedText>
          <CitiesGrid cities={cities} onCityPress={onCityPress} />
        </View>
      )}
    </ScrollView>
  );
}
