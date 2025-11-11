import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider } from "@/lib/auth";
import "@/lib/i18n";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../global.css";

export const unstable_settings = {
  anchor: "(auth)",
};

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack initialRouteName="(auth)">
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(master)" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
