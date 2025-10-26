import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ReviewsListView } from "@/modules/master/reviews/ui/views/ReviewsListView";

export default function ReviewsScreen() {
  return (
    <View style={styles.container}>
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
    paddingBottom: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
});
