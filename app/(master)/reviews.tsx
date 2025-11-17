import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ReviewsListView } from "@/modules/master/reviews/ui/views/ReviewsListView";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function ReviewsScreen() {
  const backgroundColor = useThemeColor(
    { light: "#F3F4F6", dark: "#000000" },
    "background"
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Reviews
        </ThemedText>
      </View>
      <ReviewsListView />
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
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
});
