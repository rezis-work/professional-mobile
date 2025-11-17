import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { BillingListView } from "@/modules/master/billing/ui/views/BillingListView";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function BillingScreen() {
  const backgroundColor = useThemeColor(
    { light: "#F3F4F6", dark: "#000000" },
    "background"
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Billing
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Manage your billing and payments
        </ThemedText>
      </View>
      <BillingListView />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 12,
    gap: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
});
