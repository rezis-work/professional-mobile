import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { TouchableOpacity, Alert } from "react-native";
import { useAuth } from "@/lib/auth";
import { useRouter } from "expo-router";

export default function MasterDashboardScreen() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert("Signed out", "You have been logged out.");
      router.replace("/(auth)/login");
    } catch {
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  return (
    <ThemedView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
      }}
    >
      <ThemedText type="title">Master Dashboard</ThemedText>
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          backgroundColor: "#EF4444",
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 8,
        }}
      >
        <ThemedText style={{ color: "white" }}>Logout</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
