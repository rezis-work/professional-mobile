import { ThemedText } from "@/components/themed-text";
import { useToast } from "@/components/toast";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import api from "@/lib/api";
import { logger } from "@/lib/logger";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Animated,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { loginSchema, type LoginFormValues } from "./schema";

export default function LoginScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const qc = useQueryClient();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const translateY = useRef(new Animated.Value(0)).current;
  const passwordInputRef = useRef<TextInput>(null);
  const emailErrorOpacity = useRef(new Animated.Value(0)).current;
  const passwordErrorOpacity = useRef(new Animated.Value(0)).current;
  const serverErrorOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (event) => {
        const keyboardHeight = event.endCoordinates.height;
        Animated.timing(translateY, {
          toValue: Platform.OS === "ios" ? -keyboardHeight / 2 : -80,
          duration: Platform.OS === "ios" ? event.duration || 250 : 250,
          useNativeDriver: true,
        }).start();
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      (event) => {
        Animated.timing(translateY, {
          toValue: 0,
          duration: Platform.OS === "ios" ? event.duration || 250 : 250,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [translateY]);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const inputBg = useThemeColor(
    { light: "#FFFFFF", dark: "#1F2937" },
    "background"
  );
  const errorColor = useThemeColor(
    { light: "#EF4444", dark: "#F87171" },
    "text"
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const res = await api.post("/api/auth/admin-login", data);
      return res.data;
    },
    onSuccess: async (data) => {
      logger.info("Login success", data);
      setServerError(null); // Clear server error on success
      // Optimistically set user to unlock guarded routes immediately
      if (data?.user) {
        qc.setQueryData(["me"], data.user);
      }
      await qc.invalidateQueries({ queryKey: ["me"] });
      await qc.refetchQueries({ queryKey: ["me"] });
      router.replace("/(master)");
      showToast("Welcome back!", "success");
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || "Login failed";
      logger.error("Login failed", err);
      setServerError(message);
    },
  });

  // Animate email error
  useEffect(() => {
    Animated.timing(emailErrorOpacity, {
      toValue: errors.email ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [errors.email, emailErrorOpacity]);

  // Animate password error
  useEffect(() => {
    Animated.timing(passwordErrorOpacity, {
      toValue: errors.password && !errors.email && !serverError ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [errors.password, errors.email, serverError, passwordErrorOpacity]);

  // Animate server error
  useEffect(() => {
    Animated.timing(serverErrorOpacity, {
      toValue: serverError && !errors.email && !errors.password ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [serverError, errors.email, errors.password, serverErrorOpacity]);

  const onSubmit = (data: LoginFormValues) => {
    setServerError(null); // Clear server error when submitting
    mutate(data);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor },
        {
          transform: [{ translateY }],
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: isDark ? "#3B82F6" : "#2563EB",
                },
              ]}
            >
              <Ionicons name="lock-closed" size={32} color="#FFFFFF" />
            </View>
            <ThemedText type="title" style={styles.title}>
              Welcome Back
            </ThemedText>
            <ThemedText style={styles.subtitle}>Sign in to continue</ThemedText>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <View>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <View
                      style={[
                        styles.inputContainer,
                        emailFocused && styles.inputFocused,
                        (serverError || errors.email) && styles.inputError,
                        {
                          borderColor:
                            serverError || errors.email
                              ? errorColor
                              : emailFocused
                              ? "#3B82F6"
                              : isDark
                              ? "#4B5563"
                              : "#D1D5DB",
                          backgroundColor: inputBg,
                        },
                      ]}
                    >
                      <Ionicons
                        name="mail-outline"
                        size={20}
                        color={
                          serverError || errors.email
                            ? errorColor
                            : emailFocused
                            ? "#3B82F6"
                            : isDark
                            ? "#9CA3AF"
                            : "#6B7280"
                        }
                        style={styles.inputIcon}
                      />
                      <TextInput
                        placeholder="Email address"
                        placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        autoComplete="email"
                        textContentType="emailAddress"
                        returnKeyType="next"
                        value={value}
                        onChangeText={(text) => {
                          onChange(text);
                          setServerError(null); // Clear server error when typing
                        }}
                        onFocus={() => setEmailFocused(true)}
                        onBlur={() => {
                          setEmailFocused(false);
                          onBlur();
                        }}
                        onSubmitEditing={() => {
                          passwordInputRef.current?.focus();
                        }}
                        style={[styles.input, { color: textColor }]}
                        editable={!isPending && !isSubmitting}
                      />
                    </View>
                  </>
                )}
              />
            </View>

            {/* Password Input */}
            <View>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <View
                      style={[
                        styles.inputContainer,
                        passwordFocused && styles.inputFocused,
                        (serverError || errors.password) && styles.inputError,
                        {
                          borderColor:
                            serverError || errors.password
                              ? errorColor
                              : passwordFocused
                              ? "#3B82F6"
                              : isDark
                              ? "#4B5563"
                              : "#D1D5DB",
                          backgroundColor: inputBg,
                        },
                      ]}
                    >
                      <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color={
                          serverError || errors.password
                            ? errorColor
                            : passwordFocused
                            ? "#3B82F6"
                            : isDark
                            ? "#9CA3AF"
                            : "#6B7280"
                        }
                        style={styles.inputIcon}
                      />
                      <TextInput
                        ref={passwordInputRef}
                        placeholder="Password"
                        placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                        secureTextEntry={!showPassword}
                        autoComplete="password"
                        textContentType="password"
                        returnKeyType="done"
                        value={value}
                        onChangeText={(text) => {
                          onChange(text);
                          setServerError(null); // Clear server error when typing
                        }}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => {
                          setPasswordFocused(false);
                          onBlur();
                        }}
                        onSubmitEditing={handleSubmit(onSubmit)}
                        style={[styles.input, { color: textColor, flex: 1 }]}
                        editable={!isPending && !isSubmitting}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Ionicons
                          name={
                            showPassword ? "eye-outline" : "eye-off-outline"
                          }
                          size={20}
                          color={isDark ? "#9CA3AF" : "#6B7280"}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.errorContainer}>
                      {errors.email ? (
                        <Animated.View
                          style={{
                            opacity: emailErrorOpacity,
                            transform: [
                              {
                                translateY: emailErrorOpacity.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [-8, 0],
                                }),
                              },
                            ],
                          }}
                        >
                          <ThemedText
                            style={[styles.errorText, { color: errorColor }]}
                          >
                            {errors.email.message}
                          </ThemedText>
                        </Animated.View>
                      ) : errors.password ? (
                        <Animated.View
                          style={{
                            opacity: passwordErrorOpacity,
                            transform: [
                              {
                                translateY: passwordErrorOpacity.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [-8, 0],
                                }),
                              },
                            ],
                          }}
                        >
                          <ThemedText
                            style={[styles.errorText, { color: errorColor }]}
                          >
                            {errors.password.message}
                          </ThemedText>
                        </Animated.View>
                      ) : serverError ? (
                        <Animated.View
                          style={{
                            opacity: serverErrorOpacity,
                            transform: [
                              {
                                translateY: serverErrorOpacity.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [-8, 0],
                                }),
                              },
                            ],
                          }}
                        >
                          <ThemedText
                            style={[styles.errorText, { color: errorColor }]}
                          >
                            {serverError}
                          </ThemedText>
                        </Animated.View>
                      ) : (
                        <ThemedText style={styles.errorText}></ThemedText>
                      )}
                    </View>
                  </>
                )}
              />
            </View>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={isPending || isSubmitting}
              style={[
                styles.button,
                (isPending || isSubmitting) && styles.buttonDisabled,
              ]}
              activeOpacity={0.8}
            >
              {isPending || isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <ThemedText style={styles.buttonText}>Sign In</ThemedText>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    padding: 16,
    maxWidth: 400,
    width: "100%",
    alignSelf: "center",
    ...Platform.select({
      ios: {
        padding: 16,
      },
      android: {
        padding: 16,
      },
    }),
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
  },
  form: {
    gap: 20,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: 48,
    ...Platform.select({
      ios: {
        paddingVertical: 0,
      },
      android: {
        paddingVertical: 0,
      },
    }),
  },
  inputFocused: {
    borderWidth: 2,
  },
  inputError: {
    borderWidth: 2,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
    paddingTop: 0,
    paddingBottom: 0,
    minHeight: 20,
    ...Platform.select({
      ios: {
        paddingVertical: 0,
      },
      android: {
        paddingVertical: 0,
        paddingTop: 0,
        paddingBottom: 0,
        textAlignVertical: "center",
      },
    }),
  },
  errorContainer: {
    minHeight: 20,
    marginTop: 2,
    marginLeft: 4,
  },
  errorText: {
    fontSize: 12,
  },
  eyeButton: {
    padding: 4,
    marginLeft: 8,
  },
  button: {
    backgroundColor: "#3B82F6",
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  buttonDisabled: {
    backgroundColor: "#9CA3AF",
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
