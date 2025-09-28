import { Redirect } from "expo-router";
import { useAuth } from "@/lib/auth";
import { logger } from "@/lib/logger";

export default function RootIndex() {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  logger.info("User", user);
  return <Redirect href={user ? "/(master)" : "/(auth)/login"} />;
}
