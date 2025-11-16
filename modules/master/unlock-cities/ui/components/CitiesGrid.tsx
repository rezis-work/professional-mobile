import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";
import type { City } from "../../types";

function CityImage({
  imageUrl,
  isActive,
}: {
  imageUrl: string;
  isActive: boolean;
}) {
  return (
    <View className="relative w-full h-36">
      <Image
        source={{ uri: imageUrl }}
        className="w-full h-36"
        resizeMode="cover"
      />
      <View
        className="absolute inset-0"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        }}
        pointerEvents="none"
      />
      {isActive && (
        <View className="absolute top-2 right-2 bg-green-500 rounded-full px-2.5 py-1 z-20">
          <View className="flex-row items-center">
            <Ionicons name="checkmark-circle" size={12} color="white" />
            <Text className="text-xs font-bold text-white ml-1">Active</Text>
          </View>
        </View>
      )}
    </View>
  );
}

export function CitiesGrid({
  cities,
  onCityPress,
}: {
  cities: City[];
  onCityPress: (cityId: string) => void;
}) {
  return (
    <View className="flex-row flex-wrap gap-4">
      {cities.map((city) => (
        <Pressable
          key={city.id}
          onPress={() => onCityPress(city.id)}
          className="w-[48%] bg-white dark:bg-neutral-800 rounded-3xl overflow-hidden active:opacity-90 active:scale-98"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12,
            shadowRadius: 16,
            elevation: 6,
          }}
        >
          {/* Image with loading state */}
          <CityImage imageUrl={city.imageUrl} isActive={city.isActive} />

          {/* Content */}
          <View className="p-4">
            <Text
              className="text-xl font-extrabold text-text mb-3"
              numberOfLines={1}
            >
              {city.name}
            </Text>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View
                  className={`rounded-full p-2 mr-2 ${
                    city.isActive
                      ? "bg-green-100 dark:bg-green-900/30"
                      : "bg-blue-100 dark:bg-blue-900/30"
                  }`}
                >
                  <Ionicons
                    name="location"
                    size={18}
                    color={city.isActive ? "#16a34a" : "#2563eb"}
                  />
                </View>
                <Text
                  className={`text-sm font-semibold ${
                    city.isActive
                      ? "text-green-600 dark:text-green-400"
                      : "text-blue-600 dark:text-blue-400"
                  }`}
                >
                  View Areas
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={city.isActive ? "#16a34a" : "#2563eb"}
              />
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
}
