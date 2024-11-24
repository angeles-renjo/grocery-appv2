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
import { styles } from "@/styles/addItemModal.styles";
import { TodoList } from "@/utils/types";

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  list: TodoList;
}

export const AddItemModal = ({
  visible,
  onClose,
  onSubmit,
  list,
}: AddItemModalProps): JSX.Element => {
  const [itemName, setItemName] = useState("");
  const [nameError, setNameError] = useState("");

  // If list is completed, close modal
  React.useEffect(() => {
    if (visible && list.isCompleted) {
      onClose();
    }
  }, [visible, list.isCompleted]);

  const handleSubmit = () => {
    // Prevent adding items to completed lists
    if (list.isCompleted) {
      setNameError("Cannot add items to completed lists");
      return;
    }

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

  // Return empty modal if list is completed
  if (list.isCompleted) {
    return (
      <Modal
        visible={false}
        animationType="slide"
        transparent
        onRequestClose={onClose}
      >
        <View />
      </Modal>
    );
  }

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
              editable={!list.isCompleted}
            />
            {nameError ? (
              <Text style={styles.errorText}>{nameError}</Text>
            ) : null}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.addButton,
                list.isCompleted && styles.disabledButton,
              ]}
              onPress={handleSubmit}
              disabled={list.isCompleted}
            >
              <Text
                style={[
                  styles.addButtonText,
                  list.isCompleted && styles.disabledButtonText,
                ]}
              >
                Add Item
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
