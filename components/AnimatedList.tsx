import { TouchableOpacity, View, Text } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
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

export const AnimatedList = ({ list, onDelete }: AnimatedListProps) => {
  const router = useRouter();

  const handleDelete = (e: any) => {
    e.stopPropagation();
    onDelete(list.listId);
  };

  const handlePress = () => {
    router.push(`/list/${list.listId}`);
  };

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      style={styles.listContainer}
    >
      <TouchableOpacity
        style={styles.listContent}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Animated.View
          entering={SlideInRight.duration(300)}
          style={styles.listHeader}
        >
          <View style={styles.listTitleContainer}>
            <Text style={styles.listTitle}>{list.title}</Text>
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
