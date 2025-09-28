import { ScrollView, View } from "react-native";
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

export function UnlockedLocationsView() {
  const { data, isLoading, isError, error } = useGetUnlockedMasterLocations();
  const { mutate: deleteUnlockedLocation, isPending } =
    useDeleteUnlockedLocation();

  const unlockedCities: UnlockedCity[] = data?.data || [];

  if (isLoading) return <UnlockedSkeleton />;
  if (isError) return <UnlockedError message={(error as any)?.message} />;
  if (unlockedCities.length === 0) return <UnlockedNoData />;

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      <View style={{ gap: 8, alignItems: "center" }}>
        <ThemedText type="title">My Unlocked Cities</ThemedText>
        <ThemedText>
          {unlockedCities.length}{" "}
          {unlockedCities.length === 1 ? "city unlocked" : "cities unlocked"}
        </ThemedText>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {unlockedCities.map((city) => {
          const unlockedDate = new Date(city.unlockedAt).toLocaleDateString();
          return (
            <View key={city.cityPartId} style={{ width: "48%" }}>
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
  );
}
