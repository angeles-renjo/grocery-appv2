// components/ui/ToastContainer.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Toast } from "../../utils/types";
import { ToastItem } from "@/components/ui/ToastItem";

interface ToastContainerProps {
  toasts: Toast[];
  onHide: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onHide,
}) => {
  return (
    <View style={styles.container}>
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onHide={() => onHide(toast.id)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    zIndex: 999,
    padding: 16,
  },
});
