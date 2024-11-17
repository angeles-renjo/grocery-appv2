// AddItemModal.tsx
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { styles } from "@/styles/addItemModal";

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export const AddItemModal = ({
  visible,
  onClose,
  onSubmit,
}: AddItemModalProps): JSX.Element => {
  const [itemName, setItemName] = useState("");
  const [nameError, setNameError] = useState("");

  const handleSubmit = () => {
    const trimmedName = itemName.trim();

    if (!trimmedName) {
      setNameError("Item name is required");
      return;
    }

    onSubmit(trimmedName);
    setItemName("");
    setNameError("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Add New Item</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <AntDesign name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, nameError && styles.inputError]}
              value={itemName}
              onChangeText={(text) => {
                setItemName(text);
                if (nameError) setNameError("");
              }}
              placeholder="Enter item name"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
            {nameError ? (
              <Text style={styles.errorText}>{nameError}</Text>
            ) : null}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
              <Text style={styles.addButtonText}>Add Item</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
