import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
} from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { AntDesign, Feather } from "@expo/vector-icons";
import { TodoItem } from "@/utils/types";
import { todoListStyles as styles } from "@/styles/todoList.styles";
import { ListDatePicker } from "@/components/ListDatePicker";
import { PriceEditModal } from "@/components/PriceEditModal";
import { AddItemModal } from "@/components/AddItemModal";
import { useTodoContext } from "@/hooks/useTodoContext";
import { useToast } from "@/context/toast/ToastContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { groceryNormalizer } from "@/utils/groceryNormalizer";

interface EditingItem {
  itemId: number;
  name: string;
}

export default function ListDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const { showToast } = useToast();
  const colorScheme = useColorScheme();

  const {
    state: { lists, loading },
    addItem,
    updateItem,
    deleteItem,
    updateList,
    deleteList,
  } = useTodoContext();

  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TodoItem | null>(null);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);

  // Find the current list from context
  const list = lists.find((l) => l.listId === Number(id));

  useEffect(() => {
    if (!list && !loading) {
      showToast("List not found", "error");
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

  const handleAddItem = async (name: string) => {
    if (!list) return;

    // Add explicit duplicate check here
    const isDuplicate = list.items.some((item) =>
      groceryNormalizer.isSameItem(item.name, name)
    );

    if (isDuplicate) {
      showToast("This item already exists in the list", "error");
      return;
    }

    await addItem(list.listId, name, { quantity: 1, price: 0 });
    setShowAddItemModal(false);
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!list) {
      showToast("List not found", "error");
      return;
    }
    await deleteItem(list.listId, itemId);
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
            if (!list) {
              showToast("List not found", "error");
              return;
            }
            await deleteList(list.listId);
            router.back();
          },
        },
      ]
    );
  };

  const handleUpdateDueDate = async (newDate: Date) => {
    if (!list) {
      showToast("List not found", "error");
      return;
    }
    await updateList(list.listId, { dueDate: newDate });
  };

  const handleStartEditingItem = (item: TodoItem, event: any) => {
    event.stopPropagation();
    setEditingItem({ itemId: item.itemId, name: item.name });
  };

  const handleSubmitItemEdit = async () => {
    if (!list || !editingItem || !editingItem.name.trim()) {
      showToast("Item name cannot be empty", "error");
      return;
    }

    try {
      await updateItem(list.listId, editingItem.itemId, {
        name: editingItem.name.trim(),
      });
      setEditingItem(null);
    } catch (error) {
      showToast("Failed to update item name", "error");
    }
  };

  const handleCancelItemEdit = () => {
    setEditingItem(null);
  };

  const handleUpdatePriceAndQuantity = async (
    newPrice: number,
    newQuantity: number,
    newName: string
  ) => {
    if (!list || !selectedItem) {
      showToast("Invalid selection", "error");
      return;
    }

    try {
      await updateItem(list.listId, selectedItem.itemId, {
        price: newPrice,
        quantity: newQuantity,
        name: newName,
      });
      setShowPriceModal(false);
      setSelectedItem(null);
    } catch (error) {
      showToast("Failed to update item", "error");
    }
  };

  const toggleItemCompletion = async (item: TodoItem) => {
    if (!list) {
      showToast("List not found", "error");
      return;
    }
    await updateItem(list.listId, item.itemId, {
      completed: !item.completed,
    });
  };

  const handleItemPress = (item: TodoItem) => {
    if (!editingItem) {
      setSelectedItem(item);
      setShowPriceModal(true);
    }
  };

  const renderItem = ({ item }: { item: TodoItem }) => (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        {
          backgroundColor:
            Colors[colorScheme === "dark" ? "dark" : "light"].primary,
        },
      ]}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.7}
    >
      <TouchableOpacity
        onPress={() => toggleItemCompletion(item)}
        style={styles.itemCheckbox}
      >
        <View
          style={[
            styles.checkbox,
            {
              borderColor:
                Colors[colorScheme === "dark" ? "dark" : "light"].text,
            },
            item.completed && styles.checkboxChecked,
          ]}
        >
          {item.completed && (
            <AntDesign
              name="check"
              size={16}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.itemContent}>
        <ThemedText
          style={[
            styles.itemText,
            item.completed && styles.itemTextCompleted,
            { color: Colors[colorScheme === "dark" ? "dark" : "light"].text },
          ]}
        >
          {item.name}
        </ThemedText>
        <View style={styles.itemDetails}>
          <ThemedText style={styles.quantityText}>×{item.quantity}</ThemedText>
          <ThemedText style={styles.priceText}>
            ${(item.price * (item.quantity || 1)).toFixed(2)}
          </ThemedText>
        </View>
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
      <ThemedView backgroundColor="background" style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={Colors[colorScheme === "dark" ? "dark" : "light"].accent}
        />
      </ThemedView>
    );
  }

  if (!list) {
    return (
      <ThemedView backgroundColor="background" style={styles.container}>
        <ThemedText>List not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView
      style={[
        { flex: 1 },
        {
          backgroundColor:
            Colors[colorScheme === "dark" ? "dark" : "light"].background,
        },
      ]}
      edges={["bottom"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[
          styles.container,
          {
            backgroundColor:
              Colors[colorScheme === "dark" ? "dark" : "light"].background,
          },
        ]}
        keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
      >
        <ThemedView backgroundColor="background" style={styles.container}>
          <View
            style={[
              styles.listDetailHeader,
              {
                backgroundColor:
                  Colors[colorScheme === "dark" ? "dark" : "light"].background,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.dueDateButton,
                {
                  backgroundColor:
                    Colors[colorScheme === "dark" ? "dark" : "light"].primary,
                },
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <Feather
                name="calendar"
                size={20}
                color={Colors[colorScheme === "dark" ? "dark" : "light"].text}
              />
              <ThemedText style={styles.dueDateText}>
                Due: {new Date(list.dueDate).toLocaleDateString()}
              </ThemedText>
            </TouchableOpacity>
            <ThemedText style={styles.totalText}>
              Total: ${list.total.toFixed(2)}
            </ThemedText>
          </View>

          <View
            style={[
              styles.topContainer,
              {
                backgroundColor:
                  Colors[colorScheme === "dark" ? "dark" : "light"].background,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.addButton,
                { backgroundColor: Colors.light.buttonBackground },
              ]}
              onPress={() => setShowAddItemModal(true)}
            >
              <AntDesign
                name="plus"
                size={24}
                color={
                  Colors[colorScheme === "dark" ? "dark" : "light"].buttonText
                }
              />
              <ThemedText
                style={[
                  styles.addButtonText,
                  {
                    color:
                      Colors[colorScheme === "dark" ? "dark" : "light"]
                        .buttonText,
                  },
                ]}
              >
                Add Item
              </ThemedText>
            </TouchableOpacity>
          </View>

          <ThemedView
            backgroundColor="background"
            style={[
              styles.contentContainer,
              {
                backgroundColor:
                  Colors[colorScheme === "dark" ? "dark" : "light"].background,
              },
            ]}
          >
            <FlatList
              data={list.items}
              renderItem={renderItem}
              keyExtractor={(item) => item.itemId.toString()}
              style={[
                styles.itemsList,
                {
                  backgroundColor:
                    Colors[colorScheme === "dark" ? "dark" : "light"]
                      .background,
                },
              ]}
              contentContainerStyle={[
                styles.itemsListContent,
                {
                  backgroundColor:
                    Colors[colorScheme === "dark" ? "dark" : "light"]
                      .background,
                },
              ]}
            />
          </ThemedView>

          <AddItemModal
            visible={showAddItemModal}
            onClose={() => setShowAddItemModal(false)}
            onSubmit={handleAddItem}
            list={list}
            existingItems={list?.items.map((item) => item.name) || []}
          />

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
            currentQuantity={selectedItem?.quantity || 1}
            onConfirm={handleUpdatePriceAndQuantity}
            onClose={() => {
              setShowPriceModal(false);
              setSelectedItem(null);
            }}
            list={list}
          />
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
