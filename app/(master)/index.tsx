import { View, Text, Pressable, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/lib/auth";
import { useRouter } from "expo-router";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useTranslation } from "react-i18next";

export default function MasterDashboardScreen() {
  const { logout } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert(t("common.success"), t("common.loggedOut"));
      router.replace("/(auth)/login");
    } catch {
      Alert.alert(t("common.error"), t("common.logoutFailed"));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScreenHeader title={t("masterNavigation.dashboard")} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-6">
          {/* Welcome Card */}
          <View
            className="bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-3xl p-6"
            style={{
              shadowColor: "#2563eb",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 5,
            }}
          >
            <View className="flex-row items-center mb-4">
              <View className="bg-white/20 rounded-full p-3 mr-4">
                <Ionicons name="home" size={28} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-lg font-bold mb-1">
                  Welcome Back!
                </Text>
                <Text className="text-white/90 text-sm">
                  Manage your profile and jobs
                </Text>
              </View>
            </View>
          </View>

          {/* Language Switcher Card */}
          <View
            className="bg-white dark:bg-neutral-800 rounded-2xl p-5 border border-gray-200 dark:border-neutral-700"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <View className="flex-row items-center mb-4">
              <View className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2.5 mr-3">
                <Ionicons name="language" size={20} color="#2563eb" />
              </View>
              <Text className="text-lg font-bold text-text">Language</Text>
            </View>
            <LanguageSwitcher />
          </View>

          {/* Logout Button */}
          <Pressable
            onPress={handleLogout}
            className="bg-red-500 dark:bg-red-600 py-4 rounded-2xl items-center flex-row justify-center active:opacity-80"
            style={{
              shadowColor: "#ef4444",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <Ionicons name="log-out-outline" size={20} color="white" />
            <Text className="text-base font-bold text-white ml-2">
              {t("common.logout")}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
