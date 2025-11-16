import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

export function UnlockSkeleton() {
  const { t } = useTranslation();
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScreenHeader title={t("masterNavigation.unlockCities")} />
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="text-base font-medium text-gray-600 dark:text-gray-400 mt-6">
          Loading cities...
        </Text>
      </View>
    </SafeAreaView>
  );
}

export function UnlockError({ message }: { message?: string }) {
  const { t } = useTranslation();
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScreenHeader title={t("masterNavigation.unlockCities")} />
      <View className="flex-1 items-center justify-center px-6">
        <View
          className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 border-2 border-red-200 dark:border-red-800"
          style={{
            shadowColor: "#ef4444",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View className="flex-row items-center mb-3">
            <View className="bg-red-100 dark:bg-red-900/40 rounded-full p-2 mr-3">
              <Ionicons name="alert-circle" size={24} color="#ef4444" />
            </View>
            <Text className="text-lg font-bold text-red-600 dark:text-red-400">
              Failed to load cities
            </Text>
          </View>
          <Text className="text-sm font-medium text-red-600 dark:text-red-400 ml-11">
            {message || "There was an error loading the cities."}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export function UnlockNoData() {
  const { t } = useTranslation();
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScreenHeader title={t("masterNavigation.unlockCities")} />
      <View className="flex-1 items-center justify-center py-16">
        <View className="bg-gray-100 dark:bg-neutral-800 rounded-full p-6 mb-4">
          <Ionicons name="location-outline" size={56} color="#9ca3af" />
        </View>
        <Text className="text-lg font-semibold text-gray-600 dark:text-gray-400">
          No cities available
        </Text>
      </View>
    </SafeAreaView>
  );
}
