import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Image, Text, View } from "react-native";

function AvatarImage({ imageUrl }: { imageUrl: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <View
      className="rounded-full p-1"
      style={{
        backgroundColor: "#2563eb",
        shadowColor: "#2563eb",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
      }}
    >
      {isLoading && (
        <View className="w-28 h-28 rounded-full bg-gray-200 dark:bg-neutral-700 items-center justify-center absolute inset-0 z-10">
          <ActivityIndicator size="small" color="#2563eb" />
        </View>
      )}
      {hasError ? (
        <View className="w-28 h-28 rounded-full bg-gray-200 dark:bg-neutral-700 items-center justify-center">
          <Ionicons name="person" size={40} color="#9ca3af" />
        </View>
      ) : (
        <Image
          source={{ uri: imageUrl }}
          className="w-28 h-28 rounded-full"
          onLoadStart={() => setIsLoading(true)}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      )}
    </View>
  );
}

export function ProfileHeader({
  displayName,
  city,
  imageUrl,
  availability,
}: {
  displayName: string;
  city: string | null;
  imageUrl: string | null;
  availability?: string | null;
}) {
  const { t } = useTranslation();

  return (
    <View className="items-center mb-4">
      {/* Avatar with border */}
      <View className="mb-4">
        {imageUrl ? (
          <AvatarImage imageUrl={imageUrl} />
        ) : (
          <View
            className="w-28 h-28 rounded-full bg-blue-500 dark:bg-blue-600 items-center justify-center"
            style={{
              shadowColor: "#2563eb",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <Ionicons name="person" size={56} color="white" />
          </View>
        )}
      </View>

      {/* Name */}
      <Text className="text-3xl font-extrabold text-text mb-2 text-center">
        {displayName}
      </Text>

      {/* City */}
      {city && (
        <View className="flex-row items-center mb-3 bg-gray-50 dark:bg-neutral-700/50 px-4 py-2 rounded-full">
          <View className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-1.5 mr-2">
            <Ionicons name="location" size={16} color="#2563eb" />
          </View>
          <Text className="text-base font-semibold text-gray-700 dark:text-gray-300">
            {city}
          </Text>
        </View>
      )}

      {/* Availability Badge */}
      {availability && (
        <View
          className="flex-row items-center bg-green-500 dark:bg-green-600 px-4 py-2 rounded-full"
          style={{
            shadowColor: "#10b981",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Ionicons name="checkmark-circle" size={18} color="white" />
          <Text className="text-sm font-bold text-white ml-2">
            {t("profile.available")} {availability}
          </Text>
        </View>
      )}
    </View>
  );
}
