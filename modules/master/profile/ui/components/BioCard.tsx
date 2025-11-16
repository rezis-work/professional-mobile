import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export function BioCard({ bio }: { bio: string | null }) {
  const { t } = useTranslation();

  return (
    <View
      className="bg-white dark:bg-neutral-800 rounded-3xl p-6 border border-gray-200 dark:border-neutral-700"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
      }}
    >
      <View className="flex-row items-center mb-4">
        <View className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2.5 mr-3">
          <Ionicons name="document-text" size={22} color="#2563eb" />
        </View>
        <Text className="text-xl font-extrabold text-text">
          {t("profile.bio")}
        </Text>
      </View>
      <View className="bg-gray-50 dark:bg-neutral-700/30 rounded-xl p-4">
        <Text className="text-base text-gray-700 dark:text-gray-300 leading-7">
          {bio || (
            <Text className="italic text-gray-400 dark:text-gray-500">
              No bio available
            </Text>
          )}
        </Text>
      </View>
    </View>
  );
}
