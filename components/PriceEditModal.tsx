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
import { TodoList } from "@/utils/types";

interface PriceEditModalProps {
  visible: boolean;
  itemName: string;
  currentPrice: number;
  currentQuantity: number;
  onConfirm: (newPrice: number, newQuantity: number, newName: string) => void;
  onClose: () => void;
  list: TodoList; // Add list prop
}

export const PriceEditModal = ({
  visible,
  itemName,
  currentPrice,
  currentQuantity,
  onConfirm,
  onClose,
  list,
}: PriceEditModalProps) => {
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setPrice(currentPrice > 0 ? currentPrice.toString() : "");
      setQuantity(currentQuantity > 0 ? currentQuantity.toString() : "1");
      setName(itemName);
      setError(null);

      // Auto-close if list is completed
      if (list.isCompleted) {
        onClose();
      }
    }
  }, [visible, currentPrice, currentQuantity, itemName, list.isCompleted]);

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  const handleConfirm = () => {
    if (list.isCompleted) {
      setError("Cannot modify items in completed lists");
      return;
    }

    const numPrice = parseFloat(price || "0");
    const numQuantity = parseInt(quantity || "1", 10);
    const trimmedName = name.trim();

    if (isNaN(numPrice) || numPrice < 0) {
      setError("Please enter a valid price");
      return;
    }

    if (isNaN(numQuantity) || numQuantity < 1) {
      setError("Please enter a valid quantity");
      return;
    }

    if (!trimmedName) {
      setError("Item name cannot be empty");
      return;
    }

    Keyboard.dismiss();
    onConfirm(numPrice, numQuantity, trimmedName);
    onClose();
  };

  const handlePriceChange = (text: string) => {
    if (list.isCompleted) {
      return;
    }
    const sanitizedText = text.replace(/[^0-9.]/g, "");
    const parts = sanitizedText.split(".");
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;
    setError(null);
    setPrice(sanitizedText);
  };

  const handleQuantityChange = (text: string) => {
    if (list.isCompleted) {
      return;
    }
    const sanitizedText = text.replace(/[^0-9]/g, "");
    setError(null);
    setQuantity(sanitizedText);
  };

  // If list is completed, return empty modal
  if (list.isCompleted) {
    return (
      <Modal
        visible={false}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View />
      </Modal>
    );
  }

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

                {/* Name Input */}
                <View style={styles.nameInputContainer}>
                  <TextInput
                    style={[
                      styles.nameInput,
                      list.isCompleted && styles.disabledInput,
                    ]}
                    value={name}
                    onChangeText={(text) => {
                      if (!list.isCompleted) {
                        setError(null);
                        setName(text);
                      }
                    }}
                    placeholder="Item name"
                    returnKeyType="next"
                    editable={!list.isCompleted}
                  />
                </View>

                <View style={styles.fieldsContainer}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.currencySymbol}>$</Text>
                    <TextInput
                      style={[
                        styles.input,
                        list.isCompleted && styles.disabledInput,
                      ]}
                      value={price}
                      onChangeText={handlePriceChange}
                      keyboardType="decimal-pad"
                      placeholder="0.00"
                      editable={!list.isCompleted}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Qty:</Text>
                    <TextInput
                      style={[
                        styles.input,
                        styles.quantityInput,
                        list.isCompleted && styles.disabledInput,
                      ]}
                      value={quantity}
                      onChangeText={handleQuantityChange}
                      keyboardType="number-pad"
                      placeholder="1"
                      editable={!list.isCompleted}
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
                    style={[
                      styles.button,
                      styles.confirmButton,
                      list.isCompleted && styles.disabledButton,
                    ]}
                    onPress={handleConfirm}
                    disabled={list.isCompleted}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        styles.confirmButtonText,
                        list.isCompleted && styles.disabledButtonText,
                      ]}
                    >
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
