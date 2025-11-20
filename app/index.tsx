import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuth } from "@/lib/auth";
import { Redirect } from "expo-router";
import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  StyleSheet,
  View,
} from "react-native";

export default function RootIndex() {
  const { user, isLoading } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const tint = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");

  useEffect(() => {
    if (isLoading) {
      // Reset animations
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);

      // Start animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isLoading, fadeAnim, scaleAnim]);

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Image
              source={require("../assets/images/main-logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <ThemedText style={[styles.appName, { color: textColor }]}>
              Professionals
            </ThemedText>
            <ThemedText style={[styles.tagline, { color: textColor }]}>
              Finding professionals in your area
            </ThemedText>
          </Animated.View>

          <Animated.View
            style={[
              styles.indicatorContainer,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <ActivityIndicator size="large" color={tint} />
          </Animated.View>
        </View>
      </ThemedView>
    );
  }

  return <Redirect href={user ? "/(master)" : "/(auth)/login"} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  logoContainer: {
    marginBottom: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 120,
    height: 120,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  appName: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 14,
    opacity: 0.7,
    fontWeight: "400",
    textAlign: "center",
  },
  indicatorContainer: {
    marginTop: 8,
  },
});
