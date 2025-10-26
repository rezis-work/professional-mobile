import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "./themed-text";
import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: "en", label: "English" },
    { code: "ka", label: "ქართული" },
    { code: "ru", label: "Русский" },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
  };

  return (
    <View style={styles.container}>
      {languages.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          style={[
            styles.button,
            currentLanguage.code === lang.code && styles.activeButton,
          ]}
          onPress={() => handleLanguageChange(lang.code)}
        >
          <ThemedText
            style={[
              styles.buttonText,
              currentLanguage.code === lang.code && styles.activeButtonText,
            ]}
          >
            {lang.label}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    padding: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: "transparent",
  },
  activeButton: {
    backgroundColor: "#3b82f6",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  activeButtonText: {
    color: "#fff",
  },
});
