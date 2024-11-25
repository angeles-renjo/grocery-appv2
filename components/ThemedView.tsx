import { View, type ViewProps } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  backgroundColor?: keyof typeof Colors.light; // Using the actual color keys
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  backgroundColor = "background",
  ...otherProps
}: ThemedViewProps) {
  const bgColor = useThemeColor(
    {
      light: lightColor || Colors.light[backgroundColor],
      dark: darkColor || Colors.dark[backgroundColor],
    },
    "background"
  );

  return <View style={[{ backgroundColor: bgColor }, style]} {...otherProps} />;
}
