import React, { useCallback } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";
import { AntDesign } from "@expo/vector-icons";
import { TodoList } from "@/utils/types";
import { todoListStyles as styles } from "@/styles/todoList.styles";
import { useRouter } from "expo-router";

interface AnimatedListProps {
  list: TodoList;
  onDelete: (listId: number) => void;
}

export const AnimatedList = React.memo(
  ({ list, onDelete }: AnimatedListProps) => {
    const router = useRouter();

    const handleDelete = useCallback(
      (e: any) => {
        e.stopPropagation();
        onDelete(list.listId);
      },
      [list.listId, onDelete]
    );

    const handlePress = useCallback(() => {
      router.push(`/list/${list.listId}`);
    }, [list.listId, router]);

    return (
      <Animated.View
        entering={FadeIn.duration(300).springify()}
        exiting={SlideOutLeft.duration(200)}
        layout={Layout.springify().duration(300)}
        style={styles.listContainer}
      >
        <TouchableOpacity
          style={styles.listContent}
          onPress={handlePress}
          activeOpacity={0.7}
        >
          <Animated.View
            entering={SlideInRight.duration(300).springify()}
            layout={Layout.springify().duration(300)}
            style={styles.listHeader}
          >
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
  }
);
