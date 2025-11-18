import { useThemeColor } from "@/hooks/use-theme-color";
import { BillingListView } from "@/modules/master/billing/ui/views/BillingListView";
import { StyleSheet } from "react-native";

export default function BillingScreen() {

  return (
    <>
      <BillingListView />
    </>
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
