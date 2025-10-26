import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { TouchableOpacity, Alert } from "react-native";
import { useAuth } from "@/lib/auth";
import { useRouter } from "expo-router";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
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
    <ThemedView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        padding: 20,
      }}
    >
      <ThemedText type="title">{t("masterNavigation.dashboard")}</ThemedText>

      <LanguageSwitcher />

      <TouchableOpacity
        onPress={handleLogout}
        style={{
          backgroundColor: "#EF4444",
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 8,
        }}
      >
        <ThemedText style={{ color: "white" }}>{t("common.logout")}</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
