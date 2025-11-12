import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "./themed-text";
import { useState, useEffect } from "react";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [current, setCurrent] = useState(i18n.language);

  const languages = [
    { code: "en", label: "English" },
    { code: "ka", label: "ქართული" },
    { code: "ru", label: "Русский" },
  ];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setCurrent(code); // trigger re-render
  };

  useEffect(() => {
    const listener = () => setCurrent(i18n.language);
    i18n.on("languageChanged", listener);
    return () => i18n.off("languageChanged", listener);
  }, [i18n]);

  return (
    <View className="flex-row bg-neutral-100 dark:bg-neutral-800 p-2 rounded-lg gap-2">
      {languages.map((lang) => {
        const isActive = current === lang.code;
        return (
          <TouchableOpacity
            key={lang.code}
            onPress={() => handleLanguageChange(lang.code)}
            className={`px-4 py-2 rounded-md ${
              isActive
                ? "bg-blue-600"
                : "bg-transparent border border-neutral-300 dark:border-neutral-600"
            }`}
          >
            <ThemedText
              className={`font-semibold text-sm ${
                isActive ? "text-white" : "text-neutral-800 dark:text-neutral-200"
              }`}
            >
              {lang.label}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
