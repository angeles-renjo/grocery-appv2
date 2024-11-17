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
  currentQuantity: number; // New prop
  onConfirm: (newPrice: number, newQuantity: number) => void; // Updated
  onClose: () => void;
}

export const PriceEditModal = ({
  visible,
  itemName,
  currentPrice,
  currentQuantity, // New prop
  onConfirm,
  onClose,
}: PriceEditModalProps) => {
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(""); // New state
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setPrice(currentPrice > 0 ? currentPrice.toString() : "");
      setQuantity(currentQuantity > 0 ? currentQuantity.toString() : "1"); // Initialize quantity
      setError(null);
    }
  }, [visible, currentPrice, currentQuantity]);

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  const handleConfirm = () => {
    const numPrice = parseFloat(price || "0");
    const numQuantity = parseInt(quantity || "1", 10);

    if (isNaN(numPrice) || numPrice < 0) {
      setError("Please enter a valid price");
      return;
    }

    if (isNaN(numQuantity) || numQuantity < 1) {
      setError("Please enter a valid quantity");
      return;
    }

    Keyboard.dismiss();
    onConfirm(numPrice, numQuantity);
    onClose();
  };

  const handlePriceChange = (text: string) => {
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

  const handleQuantityChange = (text: string) => {
    const sanitizedText = text.replace(/[^0-9]/g, "");
    setError(null);
    setQuantity(sanitizedText);
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
                <Text style={styles.title}>Update Item</Text>
                <Text style={styles.itemName}>{itemName}</Text>

                <View style={styles.fieldsContainer}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.currencySymbol}>$</Text>
                    <TextInput
                      style={styles.input}
                      value={price}
                      onChangeText={handlePriceChange}
                      keyboardType="decimal-pad"
                      placeholder="0.00"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Qty:</Text>
                    <TextInput
                      style={[styles.input, styles.quantityInput]}
                      value={quantity}
                      onChangeText={handleQuantityChange}
                      keyboardType="number-pad"
                      placeholder="1"
                    />
                  </View>
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
