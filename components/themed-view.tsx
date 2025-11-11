import { useThemeColor } from "@/hooks/use-theme-color";
import { View } from "react-native";

export type ThemedViewProps = React.ComponentProps<typeof View> & {
  lightColor?: string;
  darkColor?: string;
};

/**
 * ThemedView — supports both NativeWind className styling and
 * dynamic light/dark background colors when no className is provided.
 */

export function ThemedView({
  style,
  className,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  // If user provides Tailwind classes, NativeWind handles dark mode automatically
  return (
    <View
      className={className}
      style={[!className && { backgroundColor }, style]}
      {...otherProps}
    />
  );
}
