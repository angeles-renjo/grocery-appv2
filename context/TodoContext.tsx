import React, { createContext, useReducer, useEffect } from "react";
import { TodoStorage } from "../utils/storage";
import { TodoContextType, TodoState } from "./TodoTypes";
import { todoReducer, initialState } from "./TodoReducer";
import { createTodoActions } from "./TodoActions";

// Create context
export const TodoContext = createContext<TodoContextType | undefined>(
  undefined
);

// Context provider
export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const storage = TodoStorage.getInstance();

  const actions = createTodoActions(dispatch, storage);

  // Load lists on mount
  useEffect(() => {
    actions.loadLists();
  }, []);

  const value: TodoContextType = {
    state,
    dispatch,
    ...actions,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
