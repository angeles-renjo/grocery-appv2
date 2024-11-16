import { ThemedView } from "@/components/ThemedView";
import TodoListCreator from "@/components/TodoListCreator";

export default function HomeScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <TodoListCreator />
    </ThemedView>
  );
}
