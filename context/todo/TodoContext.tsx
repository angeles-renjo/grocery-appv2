// context/todo/TodoContext.tsx
import React, { createContext, useReducer, useEffect, useContext } from "react";
import { TodoContextType } from "./TodoTypes";
import { todoReducer, initialState } from "./TodoReducer";
import { createTodoActions } from "./TodoActions";
import { TodoStorage } from "../../utils/storage";
import { useToast } from "../toast/ToastContext";
import { TodoState } from "@/utils/types";

export const TodoContext = createContext<TodoContextType | undefined>(
  undefined
);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const storage = TodoStorage.getInstance();
  const toast = useToast();

  const actions = createTodoActions(dispatch, storage, toast);

  useEffect(() => {
    actions.loadLists();
  }, []);

  return (
    <TodoContext.Provider
      value={{
        state,
        ...actions,
        updateList: actions.updateList,
        updateItem: actions.updateItem,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  return context;
};
