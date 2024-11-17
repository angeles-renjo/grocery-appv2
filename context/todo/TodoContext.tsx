import React, { createContext, useReducer, useEffect, useContext } from "react";
import { TodoContextType } from "./TodoTypes";
import { todoReducer, initialState } from "./TodoReducer";
import { createTodoActions } from "./TodoActions";
import { TodoStorage } from "../../utils/storage";
import { useToast } from "../toast/ToastContext";
import { TodoList, TodoItem } from "../../utils/types";

export const TodoContext = createContext<TodoContextType | undefined>(
  undefined
);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const storage = TodoStorage.getInstance();
  const toast = useToast();

  // Create actions with updated addItem signature
  const actions = {
    loadLists: async () => {
      await createTodoActions(dispatch, storage, toast).loadLists();
    },
    addList: async (title: string, dueDate: Date) => {
      await createTodoActions(dispatch, storage, toast).addList(title, dueDate);
    },
    updateList: async (listId: number, updates: Partial<TodoList>) => {
      await createTodoActions(dispatch, storage, toast).updateList(
        listId,
        updates
      );
    },
    deleteList: async (listId: number) => {
      await createTodoActions(dispatch, storage, toast).deleteList(listId);
    },
    addItem: async (
      listId: number,
      name: string,
      initialData?: Partial<TodoItem>
    ) => {
      await createTodoActions(dispatch, storage, toast).addItem(
        listId,
        name,
        initialData
      );
    },
    updateItem: async (
      listId: number,
      itemId: number,
      updates: Partial<TodoItem>
    ) => {
      await createTodoActions(dispatch, storage, toast).updateItem(
        listId,
        itemId,
        updates
      );
    },
    deleteItem: async (listId: number, itemId: number) => {
      await createTodoActions(dispatch, storage, toast).deleteItem(
        listId,
        itemId
      );
    },
  };

  useEffect(() => {
    actions.loadLists();
  }, []);

  return (
    <TodoContext.Provider
      value={{
        state,
        ...actions,
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
