import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import TodoListCreator from "@/components/TodoListCreator";
import { todoListStyles as styles } from "@/styles/todoList.styles";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView backgroundColor="background" style={styles.container}>
        <TodoListCreator />
      </ThemedView>
    </SafeAreaView>
  );
}
