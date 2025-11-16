import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
}

export function ScreenHeader({ title, onBack, showBack = false }: ScreenHeaderProps) {
  return (
    <View className="px-6 pt-4 pb-2 border-b border-gray-200 dark:border-neutral-700">
      <View className="flex-row items-center">
        {showBack && onBack && (
          <Pressable onPress={onBack} className="mr-4 active:opacity-70">
            <View className="bg-blue-50 dark:bg-blue-900/30 rounded-full p-2">
              <Ionicons name="chevron-back" size={24} color="#2563eb" />
            </View>
          </Pressable>
        )}
        <Text className="text-3xl font-extrabold text-text flex-1">
          {title}
        </Text>
      </View>
    </View>
  );
}

