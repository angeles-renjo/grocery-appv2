import { useContext } from "react";
import { TodoContextType } from "@/context/todo/TodoTypes";
import { TodoContext } from "@/context/todo/TodoContext";

export const useTodoContext = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodoContext must be used within a TodoProvider");
  }
  return context;
};
