import React, { useState } from "react";
import {
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { styles } from "@/styles/addItemModal.styles";
import { TodoList } from "@/utils/types";
import { groceryNormalizer } from "@/utils/groceryNormalizer";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  list?: TodoList;
  existingItems?: string[];
}

export const AddItemModal = ({
  visible,
  onClose,
  onSubmit,
  list,
  existingItems = [],
}: AddItemModalProps): JSX.Element => {
  const [itemName, setItemName] = useState("");
  const [nameError, setNameError] = useState("");
  const colorScheme = useColorScheme();

  // Handle completed list case
  React.useEffect(() => {
    if (visible && list?.isCompleted) {
      onClose();
    }
  }, [visible, list?.isCompleted]);

  const handleSubmit = () => {
    // Prevent adding items to completed lists
    if (list?.isCompleted) {
      setNameError("Cannot add items to completed lists");
      return;
    }

    const trimmedName = itemName.trim();

    if (!trimmedName) {
      setNameError("Item name is required");
      return;
    }

    if (trimmedName.length > 100) {
      setNameError("Item name is too long (maximum 100 characters)");
      return;
    }

    // Check for duplicates using normalized name, but keep original input
    const isDuplicate = existingItems.some((existingItem) =>
      groceryNormalizer.isSameItem(existingItem, trimmedName)
    );

    if (isDuplicate) {
      setNameError("This item already exists in the list");
      return;
    }

    onSubmit(trimmedName);
    setItemName("");
    setNameError("");
    onClose();
  };

  const handleClose = () => {
    setItemName("");
    setNameError("");
    onClose();
  };

  // Return empty modal if list is completed
  if (list?.isCompleted) {
    return (
      <Modal
        visible={false}
        animationType="slide"
        transparent
        onRequestClose={handleClose}
      >
        <ThemedView />
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <ThemedView backgroundColor="background" style={styles.modalContent}>
          <ThemedView backgroundColor="background" style={styles.header}>
            <ThemedText type="subtitle">Add New Item</ThemedText>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <AntDesign
                name="close"
                size={24}
                color={Colors[colorScheme === "dark" ? "dark" : "light"].text}
              />
            </TouchableOpacity>
          </ThemedView>

          <ThemedView
            backgroundColor="background"
            style={styles.inputContainer}
          >
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor:
                    Colors[colorScheme === "dark" ? "dark" : "light"].primary,
                  color: Colors[colorScheme === "dark" ? "dark" : "light"].text,
                  borderColor: nameError
                    ? "#FF4444"
                    : Colors[colorScheme === "dark" ? "dark" : "light"]
                        .secondary,
                },
                nameError && styles.inputError,
              ]}
              value={itemName}
              onChangeText={(text) => {
                setItemName(text);
                if (nameError) setNameError("");
              }}
              placeholder="Enter item name"
              placeholderTextColor={
                Colors[colorScheme === "dark" ? "dark" : "light"].text + "80"
              }
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              editable={!list?.isCompleted}
              maxLength={100}
              autoCapitalize="sentences"
              autoCorrect={true}
              blurOnSubmit={false}
              clearButtonMode="while-editing"
            />
            {nameError ? (
              <ThemedText style={styles.errorText}>{nameError}</ThemedText>
            ) : null}
          </ThemedView>

          <ThemedView backgroundColor="background" style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
              accessibilityLabel="Cancel adding item"
            >
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.addButton,
                {
                  backgroundColor: Colors.light.buttonBackground,
                },
                list?.isCompleted && styles.disabledButton,
                !itemName.trim() && styles.disabledButton,
              ]}
              onPress={handleSubmit}
              disabled={list?.isCompleted || !itemName.trim()}
              accessibilityLabel="Add new item"
            >
              <ThemedText
                style={[
                  styles.addButtonText,
                  list?.isCompleted && styles.disabledButtonText,
                  !itemName.trim() && styles.disabledButtonText,
                ]}
              >
                Add Item
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </KeyboardAvoidingView>
    </Modal>
  );
};
