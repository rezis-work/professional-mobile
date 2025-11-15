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
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod"; // 👈 1. Import Zod

// 👈 2. Define the validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
});

export default function LoginScreen() {
  const router = useRouter();
  const qc = useQueryClient();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const translateY = useRef(new Animated.Value(0)).current;
  const isAndroid = Platform.OS === "android";
  const showEvent = isAndroid ? "keyboardDidShow" : "keyboardWillShow";
  const hideEvent = isAndroid ? "keyboardDidHide" : "keyboardWillHide";

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

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

  // 👈 3. Create a handler function for login
  const handleLogin = () => {
    // Clear any previous errors
    setError("");

    // Validate the inputs using Zod
    const validation = loginSchema.safeParse({ email, password });

    // If validation fails, show the first error and stop
    if (!validation.success) {
      const formattedErrors = validation.error.format();
      if (formattedErrors.email) {
        setError(formattedErrors.email._errors[0]);
      } else if (formattedErrors.password) {
        setError(formattedErrors.password._errors[0]);
      }
      return;
    }

    // If validation succeeds, call mutate
    mutate();
  };

  // Smooth keyboard animation
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
    <SafeAreaView className="flex-1 bg-background">
      <Animated.View
        className="flex-1 justify-center px-6"
        style={{
          transform: [{ translateY }],
        }}
      >
        <View className="mb-8">
          <Text className="text-3xl font-bold text-text font-sans">
            Professional
          </Text>
          <Text className="mt-1 opacity-70 text-base text-text font-sans">
            Sign in to access the dashboard
          </Text>
        </View>

        {/* Inputs */}
        <View className="gap-3 pb-10 relative">
          {/* EMAIL */}
          <View
            className="flex-row items-center rounded-xl px-4 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
            onTouchEnd={() => emailRef.current?.focus()}
          >
            <Feather name="mail" size={20} color="#9ca3af" className="mr-2" />
            <TextInput
              ref={emailRef}
              placeholder="Email"
              autoCapitalize="none"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              className="flex-1  text-[16px] text-text font-sans"
              style={{
                paddingVertical: 10,
                textAlignVertical: "center",
              }}
            />
          </View>

          {/* PASSWORD */}
          <View
            className="flex-row items-center rounded-xl px-4 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
            onTouchEnd={() => passwordRef.current?.focus()}
          >
            <Feather name="key" size={20} color="#9ca3af" className="mr-2" />
            <TextInput
              ref={passwordRef}
              placeholder="Password"
              placeholderTextColor="#9ca3af"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              returnKeyType="done"
              onSubmitEditing={handleLogin} // 👈 Can also trigger login on submit
              className="flex-1 text-[16px] text-text font-sans"
              style={{
                paddingVertical: 12,
                textAlignVertical: "center",
              }}
            />
          </View>

          {error ? (
            <Text className="text-red-500 text-sm absolute bottom-4 left-1 font-sans">
              {error}
            </Text>
          ) : null}
        </View>

        {/* BUTTON */}
        <TouchableOpacity
          className={`w-full py-4 rounded-xl items-center shadow-md ${
            isPending ? "bg-blue-400" : "bg-blue-600"
          }`}
          onPress={handleLogin} // 👈 4. Update the onPress handler
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-base font-sans">
              Sign In
            </Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}