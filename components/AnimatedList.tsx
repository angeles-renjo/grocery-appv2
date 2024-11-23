import React, { useState } from "react";
import { TouchableOpacity, View, Text, TextInput } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
} from "react-native-reanimated";
import { AntDesign, Feather } from "@expo/vector-icons";
import { TodoList } from "@/utils/types";
import { todoListStyles as styles } from "@/styles/todoList.styles";
import { useRouter } from "expo-router";
import { useTodoContext } from "@/hooks/useTodoContext";

interface AnimatedListProps {
  list: TodoList;
  onDelete: (listId: number) => void;
}

export const AnimatedList = ({ list, onDelete }: AnimatedListProps) => {
  const router = useRouter();
  const { updateList } = useTodoContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(list.title);

  const handleDelete = (e: any) => {
    e.stopPropagation();
    onDelete(list.listId);
  };

  const handlePress = () => {
    if (!isEditing) {
      router.push(`/list/${list.listId}`);
    }
  };

  const handleEdit = (e: any) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSubmitEdit = async () => {
    if (editedTitle.trim() && editedTitle !== list.title) {
      await updateList(list.listId, { title: editedTitle.trim() });
    } else {
      setEditedTitle(list.title); // Reset to original if empty
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedTitle(list.title);
    setIsEditing(false);
  };

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      style={styles.listContainer}
    >
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
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
                <Text style={styles.listTitle}>{list.title}</Text>
                <TouchableOpacity
                  onPress={handleEdit}
                  style={styles.editButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Feather name="edit-2" size={16} color="#666666" />
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.listInfo}>
              <Text style={styles.itemCount}>
                {list.items.length} {list.items.length === 1 ? "item" : "items"}
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
  );
};
