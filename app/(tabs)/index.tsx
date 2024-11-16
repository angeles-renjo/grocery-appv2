// app/index.tsx
import React from "react";
import { View } from "react-native";
import TodoListCreator from "@/components/TodoListCreator"; // Updated import
import { todoListStyles as styles } from "@/styles/todoList.styles";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TodoListCreator />
      </View>
    </SafeAreaView>
  );
}
