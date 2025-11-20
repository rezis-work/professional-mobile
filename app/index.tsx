import { useAuth } from "@/lib/auth";
import { Redirect } from "expo-router";

export default function RootIndex() {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  return <Redirect href={user ? "/(master)" : "/(auth)/login"} />;
}
