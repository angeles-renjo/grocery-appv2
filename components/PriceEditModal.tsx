// PriceEditModal.tsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { styles } from "@/styles/priceEditModal.styles";

interface PriceEditModalProps {
  visible: boolean;
  itemName: string;
  currentPrice: number;
  onConfirm: (newPrice: number) => void;
  onClose: () => void;
}

export const PriceEditModal = ({
  visible,
  itemName,
  currentPrice,
  onConfirm,
  onClose,
}: PriceEditModalProps) => {
  const [price, setPrice] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setPrice(currentPrice > 0 ? currentPrice.toString() : "");
      setError(null);
    }
  }, [visible, currentPrice]);

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  const handleConfirm = () => {
    const numPrice = parseFloat(price || "0");
    if (isNaN(numPrice) || numPrice < 0) {
      setError("Please enter a valid price");
      return;
    }
    Keyboard.dismiss();
    onConfirm(numPrice);
    onClose();
  };

  const handleChangeText = (text: string) => {
    const sanitizedText = text.replace(/[^0-9.]/g, "");
    const parts = sanitizedText.split(".");
    if (parts.length > 2) {
      return;
    }
    if (parts[1] && parts[1].length > 2) {
      return;
    }
    setError(null);
    setPrice(sanitizedText);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.title}>Update Price</Text>
                <Text style={styles.itemName}>{itemName}</Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.input}
                    value={price}
                    onChangeText={handleChangeText}
                    keyboardType="decimal-pad"
                    autoFocus
                    placeholder="0.00"
                  />
                </View>

                {error && <Text style={styles.errorText}>{error}</Text>}

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={handleClose}
                  >
                    <Text style={[styles.buttonText, styles.cancelButtonText]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.confirmButton]}
                    onPress={handleConfirm}
                  >
                    <Text style={[styles.buttonText, styles.confirmButtonText]}>
                      Confirm
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};
