import { useContext } from "react";
import { TodoContext } from "../context/TodoContext";
import { TodoContextType } from "../context/TodoTypes";

export const useTodoContext = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodoContext must be used within a TodoProvider");
  }
  return context;
};
