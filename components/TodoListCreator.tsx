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
import { todoListStyles as styles } from "@/styles/todoList.styles";
import { ListDatePicker } from "./ListDatePicker";
import { useTodoContext } from "@/hooks/useTodoContext";
import { useToast } from "@/context/toast/ToastContext";
import { AnimatedList } from "@/components/AnimatedList";

export default function TodoListCreator() {
  const router = useRouter();
  const {
    state: { lists, loading },
    addList,
    deleteList,
    loadLists,
  } = useTodoContext();
  const toast = useToast();

  const [newListTitle, setNewListTitle] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Animated values
  const shakeOffset = useSharedValue(0);
  const createButtonScale = useSharedValue(1);

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
      // Animate button press
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
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading your lists...</Text>
      </Animated.View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.createListContainer, createContainerStyle]}>
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
        <Animated.View style={createButtonStyle}>
          <TouchableOpacity
            onPress={handleCreateList}
            style={styles.createListButton}
            activeOpacity={0.7}
          >
            <AntDesign name="pluscircle" size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      <Animated.FlatList
        data={lists}
        renderItem={({ item }) => (
          <AnimatedList list={item} onDelete={handleDeleteList} />
        )}
        keyExtractor={(list) => list.listId.toString()}
        style={styles.listsList}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          loadLists().finally(() => setRefreshing(false));
        }}
        contentContainerStyle={styles.listsContainer}
        showsVerticalScrollIndicator={false}
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
