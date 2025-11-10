import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import api from "@/lib/api";
import { logger } from "@/lib/logger";
import { Feather } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();
  const qc = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
      Alert.alert("Signed in", "Welcome back!");
    },
    onError: (err: any) => {
      logger.error("Login failed", err);

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ThemedView style={styles.container}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>Professional</ThemedText>
            <ThemedText style={styles.subtitle}>
              Sign in to access the dashboard
            </ThemedText>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.inputContainer}>
              <Feather
                name="mail"
                size={20}
                color="#9ca3af"
                style={styles.icon}
              />
              <TextInput
                placeholder="Email"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputContainer}>
              <Feather
                name="key"
                size={20}
                color="#9ca3af"
                style={styles.icon}
              />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                returnKeyType="done"
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                }}
              />
            </View>

            {error ? (
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            ) : (
              <ThemedText style={styles.errorText}></ThemedText>
            )}
          </View>

          <TouchableOpacity
            style={[styles.button, isPending && styles.disabled]}
            onPress={() => mutate()}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.buttonText}>Sign In</ThemedText>
            )}
          </TouchableOpacity>
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    backgroundColor: "#f9fafb", // soft neutral background
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginTop: 8,
    paddingTop: 3,
  },
  subtitle: {
    color: "#6b7280",
    fontSize: 15,
    marginTop: 4,
  },
  inputWrapper: {
    width: "100%",
    gap: 16,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#111827",
    fontSize: 16,
    paddingVertical: 14,
  },
  button: {
    width: "100%",
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  disabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  errorText: {
    color: "#ef4444",
    textAlign: "left",
    marginLeft: 5,
    fontWeight: "400",
  },
});
