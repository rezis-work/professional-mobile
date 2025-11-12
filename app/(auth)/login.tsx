import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import api from "@/lib/api";
import { logger } from "@/lib/logger";
import { Feather } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Keyboard,
  KeyboardEvent,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();
  const qc = useQueryClient();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const translateY = useRef(new Animated.Value(0)).current;
  const showEvent =
    Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
  const hideEvent =
    Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await api.post("/api/auth/admin-login", { email, password });
      return res.data;
    },
    onSuccess: async (data) => {
      logger.info("Login success", data);
      if (data?.user) qc.setQueryData(["me"], data.user);
      await qc.invalidateQueries({ queryKey: ["me"] });
      await qc.refetchQueries({ queryKey: ["me"] });
      router.replace("/(master)");
    },
    onError: (err: any) => {
      let message = "Something went wrong. Please try again.";
      const issues = err?.response?.data?.issues;
      if (Array.isArray(issues) && issues.length > 0) {
        const hasEmailError = issues.find((i: any) => i.path === "email");
        const hasPasswordError = issues.find((i: any) => i.path === "password");
        if (hasEmailError && hasPasswordError) {
          message = "Email and password are incorrect";
        } else if (hasEmailError) {
          message = hasEmailError.message || "Email is incorrect";
        } else if (hasPasswordError) {
          message = hasPasswordError.message || "Password is incorrect";
        }
      } else if (err?.response?.data?.message) {
        message = err.response.data.message;
      }
      setError(message);
    },
  });

  // animation for Keyboard handling
  useEffect(() => {
    const showSub = Keyboard.addListener(showEvent, (e: KeyboardEvent) => {
      Animated.timing(translateY, {
        toValue: -e.endCoordinates.height / 3,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [translateY]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Animated.View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
          transform: [{ translateY }],
        }}
      >
        <ThemedView className="mb-8">
          <ThemedText type="title">Professional</ThemedText>
          <ThemedText type="default" className="mt-1 opacity-70">
            Sign in to access the dashboard
          </ThemedText>
        </ThemedView>

        {/* Inputs */}
        <ThemedView className="gap-3 pb-10 relative">
          <ThemedView className="flex-row items-center rounded-xl px-4 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800">
            <Feather
              name="mail"
              size={20}
              color="#9ca3af"
              style={{ marginRight: 8 }}
            />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              className="flex-1 py-4 text-base text-neutral-900 dark:text-neutral-100"
            />
          </ThemedView>

          <ThemedView className="flex-row items-center rounded-xl px-4 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800">
            <Feather
              name="key"
              size={20}
              color="#9ca3af"
              style={{ marginRight: 8 }}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#9ca3af"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              returnKeyType="done"
              onSubmitEditing={() => {
                Keyboard.dismiss;
                mutate();
              }}
              className="flex-1 py-4 text-base text-neutral-900 dark:text-neutral-100"
            />
          </ThemedView>

          {error ? (
            <Text className="text-red-500 text-sm absolute bottom-4 left-1">
              {error}
            </Text>
          ) : null}
        </ThemedView>

        {/* Button */}
        <TouchableOpacity
          className={`w-full py-4 rounded-xl items-center shadow-md ${
            isPending ? "bg-blue-400" : "bg-blue-600"
          }`}
          onPress={() => mutate()}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={{ color: "#fff", fontWeight: "600" }}>
              Sign In
            </ThemedText>
          )}
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}
