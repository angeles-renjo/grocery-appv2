import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Vibration,
  Animated,
  Keyboard,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { AntDesign, Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { TodoList } from "@/utils/types";
import { todoListStyles as styles } from "@/styles/todoList.styles";
import { ListDatePicker } from "./ListDatePicker";
import { useTodoContext } from "@/hooks/useTodoContext";

// Add a custom Error type
type TodoError = {
  message: string;
  type: "error" | "warning" | "success";
  id: number;
};

export default function TodoListCreator() {
  const router = useRouter();
  const {
    state: { lists, loading },
    addList,
    deleteList,
  } = useTodoContext();

  const [newListTitle, setNewListTitle] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [errors, setErrors] = useState<TodoError[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Animation states
  const [fadeAnim] = useState(new Animated.Value(1));
  const [shakeAnim] = useState(new Animated.Value(0));
  const [createButtonScale] = useState(new Animated.Value(1));

  // Auto-dismiss errors after 3 seconds
  React.useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors((prev) => prev.slice(1));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const showError = (message: string, type: TodoError["type"] = "error") => {
    const newError: TodoError = {
      message,
      type,
      id: Date.now(),
    };
    setErrors((prev) => [...prev, newError]);

    // Provide haptic feedback based on error type
    if (Platform.OS === "ios") {
      switch (type) {
        case "error":
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
        case "success":
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case "warning":
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
      }
    } else {
      Vibration.vibrate(200);
    }
  };

  const validateListTitle = (title: string): boolean => {
    if (!title.trim()) {
      showError("Please enter a list title", "warning");
      shakeInput();
      return false;
    }
    if (title.length > 50) {
      showError("List title is too long (max 50 characters)", "warning");
      return false;
    }
    if (
      lists.some((list) => list.title.toLowerCase() === title.toLowerCase())
    ) {
      showError("A list with this name already exists", "warning");
      return false;
    }
    return true;
  };

  const shakeInput = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCreateList = async () => {
    if (!validateListTitle(newListTitle)) return;

    try {
      Keyboard.dismiss();
      // Animate button press
      Animated.sequence([
        Animated.timing(createButtonScale, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(createButtonScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      await addList(newListTitle.trim(), selectedDate);
      setNewListTitle("");
      setSelectedDate(new Date());
      showError("List created successfully", "success");
    } catch (err) {
      showError("Failed to create list");
      console.error(err);
    }
  };

  const handleDeleteList = (listId: number) => {
    Alert.alert("Delete List", "Are you sure you want to delete this list?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteList(listId);
            showError("List deleted", "success");
          } catch (err) {
            showError("Failed to delete list");
            console.error(err);
          }
        },
      },
    ]);
  };

  const renderList = ({ item: list }: { item: TodoList }) => (
    <Animated.View style={[styles.listContainer, { opacity: fadeAnim }]}>
      <TouchableOpacity
        style={styles.listContent}
        onPress={() => router.push(`/list/${list.listId}`)}
        activeOpacity={0.7}
      >
        <View style={styles.listHeader}>
          <View style={styles.listTitleContainer}>
            <Text style={styles.listTitle}>{list.title}</Text>
            <Text style={styles.itemCount}>
              {list.items.length} {list.items.length === 1 ? "item" : "items"}
            </Text>
          </View>
          <View style={styles.listActions}>
            <Text style={styles.dateText}>
              {new Date(list.dueDate).toLocaleDateString()}
            </Text>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                handleDeleteList(list.listId);
              }}
              style={styles.deleteButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <AntDesign name="delete" size={18} color="#FF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const ErrorNotification = ({ error }: { error: TodoError }) => (
    <Animated.View
      style={[
        styles.errorContainer,
        {
          backgroundColor:
            error.type === "error"
              ? "#FFE5E5"
              : error.type === "warning"
              ? "#FFF3E0"
              : "#E8F5E9",
        },
      ]}
    >
      <Text
        style={[
          styles.errorText,
          {
            color:
              error.type === "error"
                ? "#D32F2F"
                : error.type === "warning"
                ? "#EF6C00"
                : "#2E7D32",
          },
        ]}
      >
        {error.message}
      </Text>
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading your lists...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {errors.map((error) => (
        <ErrorNotification key={error.id} error={error} />
      ))}

      <Animated.View
        style={[
          styles.createListContainer,
          { transform: [{ translateX: shakeAnim }] },
        ]}
      >
        <View style={styles.createListInputContainer}>
          <TextInput
            style={styles.createListInput}
            placeholder="New list title..."
            value={newListTitle}
            onChangeText={setNewListTitle}
            maxLength={50}
            returnKeyType="done"
            onSubmitEditing={handleCreateList}
          />
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.createListDateButton}
          >
            <Feather name="calendar" size={20} color="#666" />
            <Text style={styles.createListDateText}>
              {selectedDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        </View>
        <Animated.View style={{ transform: [{ scale: createButtonScale }] }}>
          <TouchableOpacity
            onPress={handleCreateList}
            style={styles.createListButton}
            activeOpacity={0.7}
          >
            <AntDesign name="pluscircle" size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      <FlatList
        data={lists}
        renderItem={renderList}
        keyExtractor={(list) => list.listId.toString()}
        style={styles.listsList}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          useTodoContext()
            .loadLists()
            .finally(() => setRefreshing(false));
        }}
        contentContainerStyle={styles.listsContainer}
        showsVerticalScrollIndicator={false}
      />

      <ListDatePicker
        visible={showDatePicker}
        date={selectedDate}
        onClose={() => setShowDatePicker(false)}
        onConfirm={(date) => {
          setSelectedDate(date);
          setShowDatePicker(false);
        }}
      />
    </View>
  );
}
