import React, { useState } from "react";
import {
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
import { ListDatePicker } from "./ListDatePicker";
import { useTodoContext } from "@/hooks/useTodoContext";
import { useToast } from "@/context/toast/ToastContext";
import { AnimatedList } from "@/components/AnimatedList";
import { TotalComponent } from "@/components/TotalComponent"; // Added new import
import { homeScreenStyles as styles } from "@/styles/homeScreen.styles";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TodoListCreator() {
  const colorScheme = useColorScheme();
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

    const isDuplicateActive = lists.some(
      (list) =>
        !list.isCompleted && list.title.toLowerCase() === title.toLowerCase()
    );

    if (isDuplicateActive) {
      toast.showToast(
        "An active list with this name already exists",
        "warning"
      );
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
      <ThemedView backgroundColor="background" style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.accent} />
        <ThemedText type="default" textColor="text">
          Loading your lists...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView backgroundColor="background" style={styles.container}>
      {/* Total Section */}
      <TotalComponent grandTotal={grandTotal} lists={lists} />

      {/* Input Section */}
      <ThemedView backgroundColor="background" style={styles.inputSection}>
        <Animated.View style={[styles.inputContainer, createContainerStyle]}>
          <TextInput
            style={[
              styles.input,
              { color: Colors[colorScheme === "dark" ? "dark" : "light"].text },
            ]}
            placeholder="Enter list name"
            placeholderTextColor={
              Colors[colorScheme === "dark" ? "dark" : "light"].text + "80"
            } // Adding 80 for opacity
            value={newListTitle}
            onChangeText={setNewListTitle}
            maxLength={50}
            returnKeyType="done"
            onSubmitEditing={handleCreateList}
          />

          <TouchableOpacity
            style={[
              styles.dateButton,
              { backgroundColor: Colors.light.secondary },
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <ThemedText textColor="text" style={styles.dateButtonText}>
              {selectedDate.toLocaleDateString()}
            </ThemedText>
          </TouchableOpacity>
          <Animated.View style={createButtonStyle}>
            <TouchableOpacity
              style={[
                styles.addButton,
                { backgroundColor: Colors.light.buttonBackground }, // Using lightGreen for button background
              ]}
              onPress={handleCreateList}
              activeOpacity={0.7}
            >
              <AntDesign name="plus" size={20} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </ThemedView>

      {/* Lists Header */}
      <ThemedView backgroundColor="background" style={styles.listsHeader}>
        <ThemedText
          type="defaultSemiBold"
          textColor="text"
          style={styles.listsHeaderText}
        >
          YOUR LISTS
        </ThemedText>
        <TouchableOpacity
          onPress={() => setShowCompleted(!showCompleted)}
          style={[
            styles.toggleButton,
            { backgroundColor: Colors.light.secondary },
          ]}
        >
          <ThemedText textColor="text" style={styles.toggleButtonText}>
            {showCompleted ? "Show Active" : "Show Completed"}
          </ThemedText>
          <Feather
            name={showCompleted ? "list" : "check-square"}
            size={16}
            color={Colors.light.accent}
            style={styles.toggleIcon}
          />
        </TouchableOpacity>
      </ThemedView>

      {/* Lists */}
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
        ItemSeparatorComponent={() => <ThemedView style={{ height: 12 }} />}
        ListEmptyComponent={() => (
          <ThemedView
            backgroundColor="background"
            style={styles.emptyContainer}
          >
            <ThemedText textColor="text" style={styles.emptyText}>
              {showCompleted
                ? "No completed lists yet"
                : "No active lists. Create your first list!"}
            </ThemedText>
          </ThemedView>
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
    </ThemedView>
  );
}
