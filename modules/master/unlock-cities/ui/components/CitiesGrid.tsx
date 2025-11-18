import { ThemedText } from "@/components/themed-text";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { Image, Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import type { City } from "../../types";
import { useThemeColorPalette } from "@/hooks/use-theme-color-palette";

export function CitiesGrid({
  cities,
  onCityPress,
}: {
  cities: City[];
  onCityPress: (cityId: string) => void;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = useThemeColorPalette();

  return (
    <View style={styles.grid}>
      {cities.map((city) => (
        <TouchableOpacity
          key={city.id}
          onPress={() => onCityPress(city.id)}
          style={[
            styles.card,
            {
              backgroundColor: colors.cardBackground,
              borderColor: city.isActive ? colors.availabilityNow : colors.border,
            },
            isDark && styles.cardDark,
          ]}
          activeOpacity={0.7}
        >
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: city.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
            {city.isActive && (
              <View style={[styles.activeBadge, { backgroundColor: colors.availabilityNow }]}>
                <Ionicons name="checkmark-circle" size={14} color={colors.white} />
              </View>
            )}
          </View>
          <View style={styles.content}>
            <ThemedText type="subtitle" style={styles.cityName} numberOfLines={1} ellipsizeMode="tail">
              {city.name}
            </ThemedText>
            <View style={styles.footer}>
              <Ionicons
                name="location"
                size={12}
                color={city.isActive ? colors.availabilityNow : colors.primary}
              />
              <ThemedText
                style={[
                  styles.viewText,
                  { color: city.isActive ? colors.availabilityNow : colors.primary },
                ]}
                numberOfLines={1}
              >
                View Areas
              </ThemedText>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    width: "47%",
    borderRadius: 12,
    borderWidth: 1.5,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardDark: {
    borderWidth: 1,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 100,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  activeBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    borderRadius: 10,
    padding: 3,
  },
  content: {
    padding: 10,
    gap: 6,
  },
  cityName: {
    marginBottom: 0,
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewText: {
    fontSize: 11,
    fontWeight: "600",
  },
});
