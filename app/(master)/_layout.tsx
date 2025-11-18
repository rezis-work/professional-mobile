import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuth } from "@/lib/auth";
import { useGetUnreadCount } from "@/modules/master/notifications/hooks/use-get-unread-count";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

export default function MasterLayout() {
  const { t } = useTranslation();
  const tint = useThemeColor({}, "tint");
  const text = useThemeColor({}, "text");
  const background = useThemeColor({}, "background");
  const { user, isLoading } = useAuth();
  const { data: unreadData } = useGetUnreadCount();
  const unreadCount = unreadData?.unreadCount || 0;

  if (isLoading) return null;
  if (!user) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: tint,
        tabBarInactiveTintColor: text,
        tabBarStyle: { backgroundColor: background },
        headerStyle: { backgroundColor: background },
        headerTitleStyle: { color: text },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("masterNavigation.dashboard"),
          tabBarLabel: t("masterNavigation.dashboard"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="master-profile"
        options={{
          title: t("masterNavigation.masterProfile"),
          tabBarLabel: t("masterNavigation.masterProfile"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("masterNavigation.profileSettings"),
          tabBarLabel: t("masterNavigation.profileSettings"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="job-assignment"
        options={{
          title: t("masterNavigation.jobAssignment"),
          tabBarLabel: t("masterNavigation.jobAssignment"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="briefcase" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="unlock-city"
        options={{
          title: t("masterNavigation.unlockCities"),
          tabBarLabel: t("masterNavigation.unlockCities"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="location" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="unlocked-cities"
        options={{
          title: t("masterNavigation.unlockedCities"),
          tabBarLabel: t("masterNavigation.unlockedCities"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="leads"
        options={{
          title: t("masterNavigation.leads"),
          tabBarLabel: t("masterNavigation.leads"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="leads/[id]"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: t("masterNavigation.notifications"),
          tabBarLabel: t("masterNavigation.notifications"),
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <Ionicons name="notifications" size={size} color={color} />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {unreadCount > 99 ? "99+" : unreadCount.toString()}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="reviews"
        options={{
          title: t("masterNavigation.reviews"),
          tabBarLabel: t("masterNavigation.reviews"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="star" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="billing"
        options={{
          title: t("masterNavigation.billing"),
          tabBarLabel: t("masterNavigation.billing"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="card" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 12,
  },
});
