// components/TodoListCreator.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Platform,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { TodoStorage } from "../utils/storage";
import { TodoList, TodoItem } from "../utils/types";
import { todoListStyles as styles } from "../styles/todoList.styles";

const TodoListCreator = () => {
  const [lists, setLists] = useState<TodoList[]>([]);
  const [newListTitle, setNewListTitle] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerListId, setDatePickerListId] = useState<number | null>(null);

  const storage = TodoStorage.getInstance();

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    try {
      setLoading(true);
      const loadedLists = await storage.getLists();
      setLists(loadedLists);
      setError(null);
    } catch (err) {
      setError("Failed to load lists");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async () => {
    if (!newListTitle.trim()) return;

    try {
      const newList = await storage.addList({
        title: newListTitle.trim(),
        dueDate: selectedDate,
      });
      setLists((prev) => [...prev, newList]);
      setNewListTitle("");
      setSelectedDate(new Date());
      setError(null);
    } catch (err) {
      setError("Failed to create list");
      console.error(err);
    }
  };

  const handleDateChange = async (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (event.type === "set" && date) {
      setSelectedDate(date);

      if (datePickerListId) {
        try {
          await storage.updateList({
            listId: datePickerListId,
            updates: { dueDate: date },
          });

          setLists((prev) =>
            prev.map((list) =>
              list.listId === datePickerListId
                ? { ...list, dueDate: date }
                : list
            )
          );
        } catch (err) {
          setError("Failed to update due date");
          console.error(err);
        }
      }
    }
  };

  const handleAddItem = async () => {
    if (!selectedListId || !newItemName.trim()) return;

    try {
      const newItem = await storage.addItem({
        listId: selectedListId,
        name: newItemName.trim(),
      });

      setLists((prev) =>
        prev.map((list) =>
          list.listId === selectedListId
            ? { ...list, items: [...list.items, newItem] }
            : list
        )
      );
      setNewItemName("");
      setError(null);
    } catch (err) {
      setError("Failed to add item");
      console.error(err);
    }
  };

  const handleDeleteList = async (listId: number) => {
    try {
      await storage.deleteList(listId);
      setLists((prev) => prev.filter((list) => list.listId !== listId));
      if (selectedListId === listId) {
        setSelectedListId(null);
      }
      setError(null);
    } catch (err) {
      setError("Failed to delete list");
      console.error(err);
    }
  };

  const handleDeleteItem = async (listId: number, itemId: number) => {
    try {
      await storage.deleteItem({ listId, itemId });
      setLists((prev) =>
        prev.map((list) =>
          list.listId === listId
            ? {
                ...list,
                items: list.items.filter((item) => item.itemId !== itemId),
              }
            : list
        )
      );
      setError(null);
    } catch (err) {
      setError("Failed to delete item");
      console.error(err);
    }
  };

  const showDatePickerModal = (listId?: number) => {
    if (listId) {
      const list = lists.find((l) => l.listId === listId);
      if (list) {
        setSelectedDate(new Date(list.dueDate));
      }
      setDatePickerListId(listId);
    } else {
      setDatePickerListId(null);
    }
    setShowDatePicker(true);
  };

  // Inside TodoListCreator.tsx, update the DatePicker modal render function:

  const renderDatePicker = () => {
    if (Platform.OS === "ios") {
      return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showDatePicker}
          onRequestClose={() => setShowDatePicker(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowDatePicker(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <View style={styles.datePickerHeader}>
                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                      <Text style={styles.datePickerButton}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        // Create a proper DateTimePickerEvent with utcOffset
                        const event: DateTimePickerEvent = {
                          type: "set",
                          nativeEvent: {
                            timestamp: selectedDate.getTime(),
                            utcOffset: selectedDate.getTimezoneOffset() * -1,
                          },
                        };
                        handleDateChange(event, selectedDate);
                        setShowDatePicker(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.datePickerButton,
                          styles.datePickerDoneButton,
                        ]}
                      >
                        Done
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    style={styles.datePickerIOS}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      );
    }

    return (
      showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )
    );
  };

  const renderList = ({ item: list }: { item: TodoList }) => (
    <View style={styles.listContainer}>
      <View style={styles.listHeader}>
        <TouchableOpacity
          onPress={() =>
            setSelectedListId(
              list.listId === selectedListId ? null : list.listId
            )
          }
          style={styles.listTitleContainer}
        >
          <Text style={styles.listTitle}>{list.title}</Text>
        </TouchableOpacity>
        <View style={styles.listActions}>
          <TouchableOpacity
            onPress={() => showDatePickerModal(list.listId)}
            style={styles.dateButton}
          >
            <Feather
              name="calendar"
              size={16}
              color="#666"
              style={styles.calendarIcon}
            />
            <Text style={styles.dateText}>
              {new Date(list.dueDate).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteList(list.listId)}
            style={styles.deleteButton}
          >
            <AntDesign name="delete" size={18} color="#FF4444" />
          </TouchableOpacity>
        </View>
      </View>

      {selectedListId === list.listId && (
        <View style={styles.itemsContainer}>
          <View style={styles.addItemContainer}>
            <TextInput
              style={styles.addItemInput}
              placeholder="Add new item..."
              value={newItemName}
              onChangeText={setNewItemName}
              onSubmitEditing={handleAddItem}
            />
            <TouchableOpacity
              onPress={handleAddItem}
              style={styles.addItemButton}
            >
              <AntDesign name="pluscircle" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={list.items}
            keyExtractor={(item) => item.itemId.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Text style={styles.itemText}>{item.name}</Text>
                <TouchableOpacity
                  onPress={() => handleDeleteItem(list.listId, item.itemId)}
                  style={styles.deleteItemButton}
                >
                  <AntDesign name="delete" size={16} color="#FF4444" />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.createListContainer}>
        <View style={styles.createListInputContainer}>
          <TextInput
            style={styles.createListInput}
            placeholder="New list title..."
            value={newListTitle}
            onChangeText={setNewListTitle}
          />
          <TouchableOpacity
            onPress={() => showDatePickerModal()}
            style={styles.createListDateButton}
          >
            <Feather name="calendar" size={20} color="#666" />
            <Text style={styles.createListDateText}>
              {selectedDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={handleCreateList}
          style={styles.createListButton}
        >
          <AntDesign name="pluscircle" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={lists}
        renderItem={renderList}
        keyExtractor={(list) => list.listId.toString()}
        style={styles.listsList}
      />

      {renderDatePicker()}
    </View>
  );
};

export default TodoListCreator;
