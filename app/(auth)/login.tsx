import api from "@/lib/api";
import { logger } from "@/lib/logger";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Animated,
  Keyboard,
  KeyboardEvent,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { loginSchema, type LoginFormData } from "./schema";

export default function LoginScreen() {
  const router = useRouter();
  const [apiError, setApiError] = useState("");
  const qc = useQueryClient();
  const translateY = useRef(new Animated.Value(0)).current;
  const isAndroid = Platform.OS === "android";
  const showEvent = isAndroid ? "keyboardDidShow" : "keyboardWillShow";
  const hideEvent = isAndroid ? "keyboardDidHide" : "keyboardWillHide";
  const passwordInputRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const res = await api.post("/api/auth/admin-login", {
        email: data.email,
        password: data.password,
      });
      return res.data;
    },
    onSuccess: async (data) => {
      logger.info("Login success", data);
      setApiError("");
      // Optimistically set user to unlock guarded routes immediately
      if (data?.user) {
        qc.setQueryData(["me"], data.user);
      }
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
      setApiError(message);
      logger.error("Login failed", err);
    },
  });

  // Smooth keyboard animation - Animated.View instead of KeyboardAvoidingView
  useEffect(() => {
    const showSub = Keyboard.addListener(showEvent, (e: KeyboardEvent) => {
      try {
        const height = e?.endCoordinates?.height || 0;
        if (height > 0) {
          Animated.timing(translateY, {
            toValue: -height / 3,
            duration: 250,
            useNativeDriver: true,
          }).start();
        }
      } catch (error) {
        // Silently fail keyboard animation on Android if it causes issues
        logger.error("Keyboard animation error", error);
      }
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      try {
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        // Silently fail keyboard animation on Android if it causes issues
        logger.error("Keyboard hide animation error", error);
      }
    });

    return () => {
      try {
        showSub?.remove();
        hideSub?.remove();
      } catch (error) {
        // Ignore cleanup errors
      }
    };
  }, [translateY, showEvent, hideEvent]);

  const onSubmit = (data: LoginFormData) => {
    try {
      // Dismiss keyboard before submitting on Android
      if (isAndroid) {
        Keyboard.dismiss();
      }
      setApiError("");
      mutate(data);
    } catch (error) {
      logger.error("Submit error", error);
      setApiError("Something went wrong. Please try again.");
    }
  };

  return (
    <Pressable
      className="flex-1 bg-background"
      onPress={Keyboard.dismiss}
      accessible={false}
    >
      <Animated.View
        className="flex-1 px-6 py-8 gap-6 justify-center"
        style={{
          transform: [{ translateY }],
        }}
      >
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-text mb-1 tracking-tight">
            Welcome back
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            Sign in to access your account
          </Text>
        </View>

        {/* Form */}
        <View className="gap-3">
          {/* Email Input */}
          <View>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  className={`border-2 rounded-xl ${
                    errors.email || apiError
                      ? "border-red-500 dark:border-red-500 bg-red-50/50 dark:bg-red-900/10"
                      : "border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  }`}
                >
                  <View className="flex-row items-center px-4 py-4">
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={errors.email || apiError ? "#ef4444" : "#64748b"}
                    />
                    <TextInput
                      autoCapitalize="none"
                      keyboardType="email-address"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder="Enter your email"
                      placeholderTextColor="#9ca3af"
                      returnKeyType="next"
                      onSubmitEditing={() => passwordInputRef.current?.focus()}
                      className="flex-1 text-text text-[16px] ml-3"
                      style={{ textAlignVertical: "center" }}
                    />
                  </View>
                </View>
              )}
            />
          </View>

          {/* Password Input */}
          <View>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  className={`border-2 rounded-xl ${
                    errors.password || apiError
                      ? "border-red-500 dark:border-red-500 bg-red-50/50 dark:bg-red-900/10"
                      : "border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  }`}
                >
                  <View className="flex-row items-center px-4 py-4">
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={
                        errors.password || apiError ? "#ef4444" : "#64748b"
                      }
                    />
                    <TextInput
                      ref={passwordInputRef}
                      secureTextEntry
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder="Enter your password"
                      placeholderTextColor="#9ca3af"
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit(onSubmit)}
                      className="flex-1 text-text text-[16px] ml-3"
                      style={{ textAlignVertical: "center" }}
                    />
                  </View>
                </View>
              )}
            />
          </View>

          {/* Error Messages (Zod Validation & API) */}
          {(errors.email?.message || errors.password?.message || apiError) && (
            <View className="flex-row items-center mt-1">
              <Ionicons name="alert-circle" size={16} color="#ef4444" />
              <Text className="text-sm text-red-500 ml-1">
                {apiError || errors.email?.message || errors.password?.message}
              </Text>
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
            className={`w-full py-5 rounded-2xl items-center flex-row justify-center mt-2 ${
              isPending
                ? "bg-blue-400 dark:bg-blue-500"
                : "bg-blue-600 dark:bg-blue-700"
            } active:opacity-80`}
            style={{
              shadowColor: "#2563eb",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            {isPending ? (
              <>
                <Text className="text-base font-bold text-white">
                  Signing in...
                </Text>
              </>
            ) : (
              <>
                <Ionicons name="log-in-outline" size={20} color="white" />
                <Text className="text-base font-bold text-white ml-2">
                  Sign In
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Pressable>
  );
}
