// app/index.tsx
import React from "react";
import { View } from "react-native";
import TodoListCreator from "@/components/TodoListCreator"; // Updated import
import { todoListStyles as styles } from "@/styles/todoList.styles";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <TodoListCreator />
    </View>
  );
}
