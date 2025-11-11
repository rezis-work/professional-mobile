import { Text, TextStyle } from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";

export type ThemedTextProps = React.ComponentProps<typeof Text> & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  // ✅ All fontWeight values are literal-typed, not generic strings
  const typeStyles: TextStyle =
    type === "title"
      ? { fontSize: 32, fontWeight: "700", lineHeight: 36 }
      : type === "defaultSemiBold"
      ? { fontSize: 16, lineHeight: 24, fontWeight: "600" }
      : type === "subtitle"
      ? { fontSize: 20, fontWeight: "700" }
      : type === "link"
      ? { lineHeight: 30, fontSize: 16, color: "#0a7ea4" }
      : { fontSize: 16, lineHeight: 24 };

  return <Text style={[{ color }, typeStyles, style]} {...rest} />;
}
