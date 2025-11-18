import { useThemeColor } from "@/hooks/use-theme-color";
import { NotificationsListView } from "@/modules/master/notifications/ui/views/NotificationsListView";
import { StyleSheet, View } from "react-native";

export default function NotificationsScreen() {
  const backgroundColor = useThemeColor({}, "secondaryBackground");

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <NotificationsListView />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
