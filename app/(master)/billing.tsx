import { View, StyleSheet } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { BillingListView } from "@/modules/master/billing/ui/views/BillingListView";

export default function BillingScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Billing</ThemedText>
        <ThemedText type="defaultSemiBold" style={styles.subtitle}>
          Manage your billing and payments
        </ThemedText>
      </View>
      <BillingListView />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.7,
  },
});
