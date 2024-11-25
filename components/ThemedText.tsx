import { Text, type TextProps, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
  textColor?: keyof typeof Colors.light; // Using the actual color keys
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  textColor = "text",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor(
    {
      light: lightColor || Colors.light[textColor],
      dark: darkColor || Colors.dark[textColor],
    },
    "text"
  );

  return <Text style={[{ color }, styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    fontSize: 16,
    lineHeight: 30,
    color: Colors.light.accent, // Using lapis lazuli
  },
});
