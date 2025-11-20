import { HapticTab } from "@/components/haptic-tab";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useThemeColorPalette } from "@/hooks/use-theme-color-palette";
import { useAuth } from "@/lib/auth";
import { useGetUnreadCount } from "@/modules/master/notifications/hooks/use-get-unread-count";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, Text, View } from "react-native";

export default function MasterLayout() {
  const { t } = useTranslation();
  const colors = useThemeColorPalette();
  const tint = useThemeColor({}, "tint");
  const text = useThemeColor({}, "text");
  const background = useThemeColor({}, "background");
  const error = useThemeColor({}, "error");
  const white = useThemeColor({}, "white");
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
        tabBarStyle: {
          backgroundColor: background,
          ...Platform.select({
            ios: {
              position: "absolute",
              borderRadius: 20,
              marginHorizontal: 12,
              marginBottom: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.25,
              shadowRadius: 12,
              paddingTop: 6,
              height: 70,
              borderTopWidth: 0,
              borderBottomWidth: 0,
              borderWidth: 0,
              backgroundColor: colors.secondaryBackground,
            },
            android: {
              elevation: 8,
              borderTopWidth: 0,
            },
          }),
        },
        headerStyle: {
          backgroundColor: background,
        },
        headerTitleStyle: { color: text },
        headerTitleAlign: "left",
        headerShadowVisible: false,
        tabBarButton: (props) => <HapticTab {...props} />,
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
          headerTitle: () => (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Ionicons name="home" size={20} color={text} />
              <Text style={{ color: text, fontSize: 20, fontWeight: "600" }}>
                {t("masterNavigation.dashboard")}
              </Text>
            </View>
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
          headerTitle: () => (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Ionicons name="person" size={20} color={text} />
              <Text style={{ color: text, fontSize: 20, fontWeight: "600" }}>
                {t("masterNavigation.masterProfile")}
              </Text>
            </View>
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
          headerTitle: () => (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Ionicons name="settings" size={20} color={text} />
              <Text style={{ color: text, fontSize: 20, fontWeight: "600" }}>
                {t("masterNavigation.profileSettings")}
              </Text>
            </View>
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
          headerTitle: () => (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Ionicons name="briefcase" size={20} color={text} />
              <Text style={{ color: text, fontSize: 20, fontWeight: "600" }}>
                {t("masterNavigation.jobAssignment")}
              </Text>
            </View>
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
          headerTitle: () => (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Ionicons name="location" size={20} color={text} />
              <Text style={{ color: text, fontSize: 20, fontWeight: "600" }}>
                {t("masterNavigation.unlockCities")}
              </Text>
            </View>
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
          headerTitle: () => (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Ionicons name="map" size={20} color={text} />
              <Text style={{ color: text, fontSize: 20, fontWeight: "600" }}>
                {t("masterNavigation.unlockedCities")}
              </Text>
            </View>
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
          headerTitle: () => (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Ionicons name="people" size={20} color={text} />
              <Text style={{ color: text, fontSize: 20, fontWeight: "600" }}>
                {t("masterNavigation.leads")}
              </Text>
            </View>
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
                <View style={[styles.badge, { backgroundColor: error }]}>
                  <Text style={[styles.badgeText, { color: white }]}>
                    {unreadCount > 99 ? "99+" : unreadCount.toString()}
                  </Text>
                </View>
              )}
            </View>
          ),
          headerTitle: () => (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Ionicons name="notifications" size={20} color={text} />
              <Text style={{ color: text, fontSize: 20, fontWeight: "600" }}>
                {t("masterNavigation.notifications")}
              </Text>
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
          headerTitle: () => (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Ionicons name="star" size={20} color={text} />
              <Text style={{ color: text, fontSize: 20, fontWeight: "600" }}>
                {t("masterNavigation.reviews")}
              </Text>
            </View>
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
          headerTitle: () => (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Ionicons name="card" size={20} color={text} />
              <Text style={{ color: text, fontSize: 20, fontWeight: "600" }}>
                {t("masterNavigation.billing")}
              </Text>
            </View>
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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 12,
  },
});
