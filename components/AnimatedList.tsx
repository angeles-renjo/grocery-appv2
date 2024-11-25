import React, { useState, useRef } from "react";
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
import { useToast } from "@/context/toast/ToastContext";

interface AnimatedListProps {
  list: TodoList;
  onDelete: (listId: number) => void;
}

export const AnimatedList = ({ list, onDelete }: AnimatedListProps) => {
  const router = useRouter();
  const { updateList } = useTodoContext();
  const { completeList, uncompleteList } = useListCompletion(list.listId);
  const toast = useToast();
  const inputRef = useRef<TextInput>(null);

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
      // Use setTimeout to ensure the input is rendered before focusing
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleSubmitEdit = async () => {
    const trimmedTitle = editedTitle.trim();
    if (!trimmedTitle) {
      setEditedTitle(list.title);
      toast.showToast("List name cannot be empty", "error");
      setIsEditing(false);
      return;
    }

    if (trimmedTitle !== list.title) {
      try {
        await updateList(list.listId, {
          title: trimmedTitle,
          updatedAt: new Date(),
        });
        toast.showToast("List name updated successfully", "success");
      } catch (error) {
        toast.showToast("Failed to update list name", "error");
        setEditedTitle(list.title);
      }
    }
    setIsEditing(false);
  };

  const handleCancelEdit = (e?: any) => {
    e?.stopPropagation();
    setEditedTitle(list.title);
    setIsEditing(false);
  };

  const handleKeyPress = (e: any) => {
    if (e.nativeEvent.key === "Enter") {
      handleSubmitEdit();
    } else if (e.nativeEvent.key === "Escape") {
      handleCancelEdit();
    }
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
          disabled={list.isCompleted || isEditing}
        >
          <Animated.View
            entering={SlideInRight.duration(300)}
            style={styles.listHeader}
          >
            <View style={styles.titleContainer}>
              {isEditing ? (
                <View style={styles.editContainer}>
                  <TextInput
                    ref={inputRef}
                    style={styles.editInput}
                    value={editedTitle}
                    onChangeText={setEditedTitle}
                    onBlur={handleSubmitEdit}
                    onSubmitEditing={handleSubmitEdit}
                    onKeyPress={handleKeyPress}
                    blurOnSubmit={true}
                    selectTextOnFocus={true}
                    maxLength={50}
                    autoCapitalize="sentences"
                  />
                  <TouchableOpacity
                    onPress={handleCancelEdit}
                    style={styles.actionButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Feather name="x" size={18} color="#666666" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSubmitEdit}
                    style={styles.actionButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Feather name="check" size={18} color="#007AFF" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.titleRow}>
                  {!list.isCompleted && (
                    <TouchableOpacity
                      onPress={handleToggleComplete}
                      style={styles.completeButton}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Feather name="circle" size={20} color="#666666" />
                    </TouchableOpacity>
                  )}
                  <Text
                    style={[
                      styles.listTitle,
                      list.isCompleted && styles.completedTitle,
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {list.title}
                  </Text>
                  <View style={styles.rightActions}>
                    {list.isCompleted ? (
                      <TouchableOpacity
                        onPress={handleToggleComplete}
                        style={styles.actionButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Text style={styles.restoreText}>Restore</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={handleEdit}
                        style={styles.editButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Feather name="edit-2" size={16} color="#666666" />
                      </TouchableOpacity>
                    )}
                  </View>
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
              <TouchableOpacity
                onPress={handleDelete}
                style={styles.deleteButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <AntDesign name="delete" size={18} color="#FF4444" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};
