import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./themed-text";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const languages = [
    { code: "en", label: "EN", fullLabel: "English" },
    { code: "ka", label: "KA", fullLabel: "ქართული" },
    { code: "ru", label: "RU", fullLabel: "Русский" },
  ];

  useEffect(() => {
    const handleLanguageChange = () => {
      setCurrentLang(i18n.language);
    };

    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n]);

  const currentLanguage =
    languages.find((lang) => lang.code === currentLang) || languages[0];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
  };

  const containerBg = useThemeColor(
    { light: "#FFFFFF", dark: "#1F2937" },
    "background"
  );
  const borderColor = useThemeColor(
    { light: "#E5E7EB", dark: "#374151" },
    "text"
  );
  const activeBg = useThemeColor(
    { light: "#3B82F6", dark: "#2563EB" },
    "tint"
  );
  const inactiveBg = useThemeColor(
    { light: "#F9FAFB", dark: "#111827" },
    "background"
  );
  const inactiveText = useThemeColor(
    { light: "#6B7280", dark: "#9CA3AF" },
    "text"
  );
  const iconColor = useThemeColor(
    { light: "#3B82F6", dark: "#60A5FA" },
    "tint"
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: containerBg,
          borderColor: borderColor,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="language" size={20} color={iconColor} />
        </View>
        <View style={styles.buttonsContainer}>
          {languages.map((lang) => {
            const isActive = currentLanguage.code === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.button,
                  isActive
                    ? [styles.activeButton, { backgroundColor: activeBg }]
                    : [styles.inactiveButton, { backgroundColor: inactiveBg }],
                ]}
                onPress={() => handleLanguageChange(lang.code)}
                activeOpacity={0.6}
              >
                <ThemedText
                  style={[
                    styles.buttonText,
                    isActive
                      ? styles.activeButtonText
                      : { color: inactiveText },
                  ]}
                >
                  {lang.label}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1.5,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 8,
    flex: 1,
    justifyContent: "flex-end",
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 50,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  activeButton: {
    ...Platform.select({
      ios: {
        shadowColor: "#3B82F6",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  inactiveButton: {
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  activeButtonText: {
    color: "#FFFFFF",
  },
});
