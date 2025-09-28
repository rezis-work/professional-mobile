import { createContext, useContext, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

type User = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
} | null;

type AuthContextValue = {
  user: User;
  isLoading: boolean;
  refetch: () => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("/api/auth/me");
      return res.data.user as User;
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // Ignore 401s on logout; we'll still clear local state
    } finally {
      queryClient.setQueryData(["me"], null);
      await queryClient.invalidateQueries({ queryKey: ["me"] });
    }
  };

  const value = useMemo(
    () => ({ user: isError ? null : data ?? null, isLoading, refetch, logout }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, isError, isLoading, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
