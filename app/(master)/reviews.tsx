import { ReviewsListView } from "@/modules/master/reviews/ui/views/ReviewsListView";
import { StyleSheet } from "react-native";

export default function ReviewsScreen() {
  return (
    <>
      <ReviewsListView />
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
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
});
