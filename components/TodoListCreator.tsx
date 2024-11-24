import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Vibration,
  Keyboard,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { AntDesign, Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  Layout,
  withSequence,
  withTiming,
  useAnimatedStyle,
  useSharedValue,
  FadeIn,
} from "react-native-reanimated";
import { TodoList } from "@/utils/types";
import { ListDatePicker } from "./ListDatePicker";
import { useTodoContext } from "@/hooks/useTodoContext";
import { useToast } from "@/context/toast/ToastContext";
import { AnimatedList } from "@/components/AnimatedList";
import { homeScreenStyles as styles } from "@/styles/homeScreen.styles";

export default function TodoListCreator() {
  const router = useRouter();
  const {
    state: { lists, loading, grandTotal },
    addList,
    deleteList,
    loadLists,
  } = useTodoContext();
  const toast = useToast();

  const [newListTitle, setNewListTitle] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  // Animated values
  const shakeOffset = useSharedValue(0);
  const createButtonScale = useSharedValue(1);

  // Filter lists based on completion status
  const activeLists = lists.filter((list) => !list.isCompleted);
  const completedLists = lists.filter((list) => list.isCompleted);

  const validateListTitle = (title: string): boolean => {
    if (!title.trim()) {
      toast.showToast("Please enter a list title", "warning");
      handleShake();
      return false;
    }
    if (title.length > 50) {
      toast.showToast("List title is too long (max 50 characters)", "warning");
      return false;
    }
    if (
      lists.some((list) => list.title.toLowerCase() === title.toLowerCase())
    ) {
      toast.showToast("A list with this name already exists", "warning");
      return false;
    }
    return true;
  };

  const handleShake = () => {
    if (Platform.OS === "ios") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else {
      Vibration.vibrate(200);
    }

    shakeOffset.value = withSequence(
      withTiming(10, { duration: 100 }),
      withTiming(-10, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );
  };

  const handleCreateList = async () => {
    if (!validateListTitle(newListTitle)) return;

    try {
      Keyboard.dismiss();
      createButtonScale.value = withSequence(
        withTiming(0.9, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );

      await addList(newListTitle.trim(), selectedDate);
      setNewListTitle("");
      setSelectedDate(new Date());
    } catch (err) {
      toast.showToast("Failed to create list", "error");
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
          } catch (err) {
            toast.showToast("Failed to delete list", "error");
            console.error(err);
          }
        },
      },
    ]);
  };

  const createContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeOffset.value }],
  }));

  const createButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: createButtonScale.value }],
  }));

  if (loading) {
    return (
      <Animated.View
        entering={FadeIn.duration(400)}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#18181B" />
        <Text style={styles.loadingText}>Loading your lists...</Text>
      </Animated.View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Total Section */}
      <View style={styles.totalSection}>
        <Text style={styles.totalLabel}>Total Value</Text>
        <Text style={styles.totalAmount}>${grandTotal.toFixed(2)}</Text>
      </View>

      {/* Input Section */}
      <View style={styles.inputSection}>
        <Animated.View style={[styles.inputContainer, createContainerStyle]}>
          <TextInput
            style={styles.input}
            placeholder="Enter list name"
            placeholderTextColor="#A1A1AA"
            value={newListTitle}
            onChangeText={setNewListTitle}
            maxLength={50}
            returnKeyType="done"
            onSubmitEditing={handleCreateList}
          />

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {selectedDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          <Animated.View style={createButtonStyle}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleCreateList}
              activeOpacity={0.7}
            >
              <AntDesign name="plus" size={20} style={styles.addButtonIcon} />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>

      {/* Lists Section */}
      <View style={styles.listsHeader}>
        <Text style={styles.listsHeaderText}>YOUR LISTS</Text>
        <TouchableOpacity
          onPress={() => setShowCompleted(!showCompleted)}
          style={styles.toggleButton}
        >
          <Text style={styles.toggleButtonText}>
            {showCompleted ? "Show Active" : "Show Completed"}
          </Text>
          <Feather
            name={showCompleted ? "list" : "check-square"}
            size={16}
            color="#666666"
            style={styles.toggleIcon}
          />
        </TouchableOpacity>
      </View>

      <Animated.FlatList
        data={showCompleted ? completedLists : activeLists}
        renderItem={({ item }) => (
          <AnimatedList list={item} onDelete={handleDeleteList} />
        )}
        keyExtractor={(list) => list.listId.toString()}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          loadLists().finally(() => setRefreshing(false));
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        style={styles.listContainer}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {showCompleted
                ? "No completed lists yet"
                : "No active lists. Create your first list!"}
            </Text>
          </View>
        )}
        itemLayoutAnimation={Layout.springify()}
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
