import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { AntDesign, Feather } from "@expo/vector-icons";
import { TodoItem } from "@/utils/types";
import { todoListStyles as styles } from "@/styles/todoList.styles";
import { ListDatePicker } from "@/components/ListDatePicker";
import { PriceEditModal } from "@/components/PriceEditModal";
import { useTodoContext } from "@/hooks/useTodoContext";

export default function ListDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();

  const {
    state: { lists, loading },
    addItem,
    updateItem,
    deleteItem,
    updateList,
    deleteList,
  } = useTodoContext();

  const [newItemName, setNewItemName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TodoItem | null>(null);
  const [showPriceModal, setShowPriceModal] = useState(false);

  // Find the current list from context
  const list = lists.find((l) => l.listId === Number(id));

  useEffect(() => {
    if (!list && !loading) {
      setError("List not found");
      router.back();
    }
  }, [list, loading]);

  useEffect(() => {
    if (list) {
      navigation.setOptions({
        title: list.title,
        headerRight: () => (
          <TouchableOpacity
            onPress={handleDeleteList}
            style={{ marginRight: 16 }}
          >
            <AntDesign name="delete" size={24} color="#FF4444" />
          </TouchableOpacity>
        ),
      });
    }
  }, [list]);

  const handleAddItem = async () => {
    if (!newItemName.trim() || !list) return;

    try {
      // Add item with initial price of 0
      await addItem(list.listId, newItemName.trim());
      setNewItemName("");
      setError(null);
    } catch (err) {
      setError("Failed to add item");
      console.error(err);
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!list) return;

    try {
      await deleteItem(list.listId, itemId);
      setError(null);
    } catch (err) {
      setError("Failed to delete item");
      console.error(err);
    }
  };

  const handleDeleteList = () => {
    Alert.alert(
      "Delete List",
      "Are you sure you want to delete this list? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              if (list) {
                await deleteList(list.listId);
                router.back();
              }
            } catch (err) {
              setError("Failed to delete list");
              console.error(err);
            }
          },
        },
      ]
    );
  };

  const handleUpdateDueDate = async (newDate: Date) => {
    if (!list) return;

    try {
      await updateList(list.listId, { dueDate: newDate });
      setError(null);
    } catch (err) {
      setError("Failed to update due date");
      console.error(err);
    }
  };

  const handleUpdatePrice = async (newPrice: number) => {
    if (!list || !selectedItem) return;

    try {
      await updateItem(list.listId, selectedItem.itemId, {
        price: newPrice,
      });
      setError(null);
    } catch (err) {
      setError("Failed to update price");
      console.error(err);
    }
  };

  const toggleItemCompletion = async (item: TodoItem) => {
    if (!list) return;

    try {
      await updateItem(list.listId, item.itemId, {
        completed: !item.completed,
      });
    } catch (err) {
      setError("Failed to update item");
      console.error(err);
    }
  };

  const handleItemPress = (item: TodoItem) => {
    setSelectedItem(item);
    setShowPriceModal(true);
  };

  const renderItem = ({ item }: { item: TodoItem }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.7}
    >
      <TouchableOpacity
        onPress={() => toggleItemCompletion(item)}
        style={styles.itemCheckbox}
      >
        <View
          style={[styles.checkbox, item.completed && styles.checkboxChecked]}
        >
          {item.completed && <AntDesign name="check" size={16} color="white" />}
        </View>
      </TouchableOpacity>

      <View style={styles.itemContent}>
        <Text
          style={[styles.itemText, item.completed && styles.itemTextCompleted]}
        >
          {item.name}
        </Text>
        <Text style={styles.priceText}>${(item.price || 0).toFixed(2)}</Text>
      </View>

      <TouchableOpacity
        onPress={() => handleDeleteItem(item.itemId)}
        style={styles.deleteItemButton}
      >
        <AntDesign name="delete" size={16} color="#FF4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!list) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>List not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.listDetailHeader}>
        <TouchableOpacity
          style={styles.dueDateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Feather name="calendar" size={20} color="#666" />
          <Text style={styles.dueDateText}>
            Due: {new Date(list.dueDate).toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        <Text style={styles.totalText}>Total: ${list.total.toFixed(2)}</Text>
      </View>

      <FlatList
        data={list.items}
        renderItem={renderItem}
        keyExtractor={(item) => item.itemId.toString()}
        style={styles.itemsList}
        contentContainerStyle={styles.itemsListContent}
      />

      <View style={styles.addItemContainer}>
        <TextInput
          style={styles.addItemInput}
          placeholder="Add new item..."
          value={newItemName}
          onChangeText={setNewItemName}
          onSubmitEditing={handleAddItem}
          returnKeyType="done"
        />
        <TouchableOpacity onPress={handleAddItem} style={styles.addItemButton}>
          <AntDesign name="pluscircle" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ListDatePicker
        visible={showDatePicker}
        date={new Date(list.dueDate)}
        onClose={() => setShowDatePicker(false)}
        onConfirm={(date) => {
          handleUpdateDueDate(date);
          setShowDatePicker(false);
        }}
      />

      <PriceEditModal
        visible={showPriceModal}
        itemName={selectedItem?.name || ""}
        currentPrice={selectedItem?.price || 0}
        onConfirm={handleUpdatePrice}
        onClose={() => {
          setShowPriceModal(false);
          setSelectedItem(null);
        }}
      />
    </KeyboardAvoidingView>
  );
}
