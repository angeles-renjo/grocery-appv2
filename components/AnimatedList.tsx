import React, { useState } from "react";
import { TouchableOpacity, View, Text, TextInput } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  Layout,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { AntDesign, Feather } from "@expo/vector-icons";
import { TodoList } from "@/utils/types";
import { todoListStyles as styles } from "@/styles/todoList.styles";
import { useRouter } from "expo-router";
import { useTodoContext } from "@/hooks/useTodoContext";
import { useListCompletion } from "@/context/todo/TodoContext";

interface AnimatedListProps {
  list: TodoList;
  onDelete: (listId: number) => void;
}

export const AnimatedList = ({ list, onDelete }: AnimatedListProps) => {
  const router = useRouter();
  const { updateList } = useTodoContext();
  const { completeList, uncompleteList } = useListCompletion(list.listId);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(list.title);

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: withTiming(list.isCompleted ? 0.7 : 1),
    backgroundColor: withTiming(list.isCompleted ? "#f5f5f5" : "#ffffff"),
  }));

  const handleDelete = (e: any) => {
    e.stopPropagation();
    onDelete(list.listId);
  };

  const handlePress = () => {
    if (!isEditing && !list.isCompleted) {
      router.push(`/list/${list.listId}`);
    }
  };

  const handleEdit = (e: any) => {
    e.stopPropagation();
    if (!list.isCompleted) {
      setIsEditing(true);
    }
  };

  const handleSubmitEdit = async () => {
    if (editedTitle.trim() && editedTitle !== list.title) {
      await updateList(list.listId, { title: editedTitle.trim() });
    } else {
      setEditedTitle(list.title);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedTitle(list.title);
    setIsEditing(false);
  };

  const handleToggleComplete = async (e: any) => {
    e.stopPropagation();
    if (list.isCompleted) {
      await uncompleteList();
    } else {
      await completeList();
    }
  };

  return (
    <Animated.View
      layout={Layout.springify()}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
    >
      <Animated.View style={[styles.listContainer, containerStyle]}>
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.7}
          disabled={list.isCompleted}
        >
          <Animated.View
            entering={SlideInRight.duration(300)}
            style={styles.listHeader}
          >
            <View style={styles.titleContainer}>
              {isEditing ? (
                <View style={styles.editContainer}>
                  <TextInput
                    value={editedTitle}
                    onChangeText={setEditedTitle}
                    style={[styles.listTitle, styles.editInput]}
                    autoFocus
                    onBlur={handleCancelEdit}
                    onSubmitEditing={handleSubmitEdit}
                  />
                  <TouchableOpacity
                    onPress={handleSubmitEdit}
                    style={styles.editButton}
                  >
                    <AntDesign name="check" size={18} color="#4CAF50" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleCancelEdit}
                    style={styles.editButton}
                  >
                    <AntDesign name="close" size={18} color="#FF4444" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.titleRow}>
                  <TouchableOpacity
                    onPress={handleToggleComplete}
                    style={styles.completeButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Feather
                      name={list.isCompleted ? "check-circle" : "circle"}
                      size={20}
                      color={list.isCompleted ? "#4CAF50" : "#666666"}
                    />
                  </TouchableOpacity>
                  <Text
                    style={[
                      styles.listTitle,
                      list.isCompleted && styles.completedTitle,
                    ]}
                  >
                    {list.title}
                  </Text>
                  {!list.isCompleted && (
                    <TouchableOpacity
                      onPress={handleEdit}
                      style={styles.editButton}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Feather name="edit-2" size={16} color="#666666" />
                    </TouchableOpacity>
                  )}
                </View>
              )}
              <View style={styles.listInfo}>
                <Text style={styles.itemCount}>
                  {list.items.length}{" "}
                  {list.items.length === 1 ? "item" : "items"}
                </Text>
                <Text style={styles.listTotal}>
                  Total: ${list.total.toFixed(2)}
                </Text>
              </View>
            </View>
            <View style={styles.listActions}>
              <Text style={styles.dateText}>
                {new Date(list.dueDate).toLocaleDateString()}
              </Text>
              {!list.isCompleted && (
                <TouchableOpacity
                  onPress={handleDelete}
                  style={styles.deleteButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <AntDesign name="delete" size={18} color="#FF4444" />
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};
