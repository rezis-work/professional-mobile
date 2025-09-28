import { useState } from "react";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logger } from "@/lib/logger";
import api from "@/lib/api";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const qc = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await api.post("/api/auth/admin-login", { email, password });
      return res.data;
    },
    onSuccess: async (data) => {
      logger.info("Login success", data);
      // Optimistically set user to unlock guarded routes immediately
      if (data?.user) {
        qc.setQueryData(["me"], data.user);
      }
      await qc.invalidateQueries({ queryKey: ["me"] });
      await qc.refetchQueries({ queryKey: ["me"] });
      router.replace("/(master)");
      Alert.alert("Signed in", "Welcome back!");
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || "Login failed";
      logger.error("Login failed", err);
      Alert.alert("Error", message);
    },
  });

  return (
    <ThemedView
      style={{ flex: 1, padding: 24, gap: 16, justifyContent: "center" }}
    >
      <ThemedText type="title">Sign in</ThemedText>
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          borderRadius: 8,
        }}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          borderRadius: 8,
        }}
      />
      <TouchableOpacity
        onPress={() => mutate()}
        disabled={isPending}
        style={{
          backgroundColor: "#2D5BE3",
          padding: 14,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <ThemedText style={{ color: "white" }}>
          {isPending ? "Signing in..." : "Sign in"}
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
