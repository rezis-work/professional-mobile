import { ThemedText } from "@/components/themed-text";
import { Image, Pressable, View } from "react-native";
import type { City } from "../../types";

export function CitiesGrid({
  cities,
  onCityPress,
}: {
  cities: City[];
  onCityPress: (cityId: string) => void;
}) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
      {cities.map((city) => (
        <Pressable
          key={city.id}
          onPress={() => onCityPress(city.id)}
          style={{
            width: "48%",
            backgroundColor: "white",
            borderRadius: 12,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: city.isActive ? "#86efac" : "#e2e8f0",
          }}
        >
          <Image
            source={{ uri: city.imageUrl }}
            style={{ width: "100%", height: 120 }}
          />
          <View style={{ padding: 12 }}>
            <ThemedText type="subtitle">{city.name}</ThemedText>
            <ThemedText
              style={{
                marginTop: 4,
                color: city.isActive ? "#16a34a" : "#2563eb",
              }}
            >
              View Areas
            </ThemedText>
          </View>
        </Pressable>
      ))}
    </View>
  );
}
