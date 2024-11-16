// components/ui/ToastItem.tsx
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { Toast } from "../../utils/types";
import { ThemedText } from "@/components/ThemedText";

interface ToastItemProps {
  toast: Toast;
  onHide: () => void;
}

export const ToastItem: React.FC<ToastItemProps> = ({ toast, onHide }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        delay: toast.duration ? toast.duration - 300 : 2700,
        useNativeDriver: true,
      }),
    ]).start(() => onHide());
  }, []);

  return (
    <Animated.View
      style={[styles.toast, styles[toast.type], { opacity: fadeAnim }]}
    >
      <ThemedText style={styles.toastText}>{toast.message}</ThemedText>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    marginVertical: 4,
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  success: {
    backgroundColor: "#4caf50",
  },
  error: {
    backgroundColor: "#f44336",
  },
  info: {
    backgroundColor: "#2196f3",
  },
  warning: {
    backgroundColor: "#ff9800",
  },
  toastText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});
