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

  const todoActions = createTodoActions(dispatch, storage, toast);

  // Create actions with updated signatures
  const actions = {
    loadLists: async () => {
      await todoActions.loadLists();
    },
    addList: async (title: string, dueDate: Date) => {
      await todoActions.addList(title, dueDate);
    },
    updateList: async (listId: number, updates: Partial<TodoList>) => {
      await todoActions.updateList(listId, updates);
    },
    deleteList: async (listId: number) => {
      await todoActions.deleteList(listId);
    },
    addItem: async (
      listId: number,
      name: string,
      initialData?: Partial<TodoItem>
    ) => {
      await todoActions.addItem(listId, name, initialData);
    },
    updateItem: async (
      listId: number,
      itemId: number,
      updates: Partial<TodoItem>
    ) => {
      await todoActions.updateItem(listId, itemId, updates);
    },
    deleteItem: async (listId: number, itemId: number) => {
      await todoActions.deleteItem(listId, itemId);
    },
    completeList: async (listId: number) => {
      await todoActions.updateList(listId, {
        isCompleted: true,
        completedAt: new Date(),
      });
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

// Add a custom hook for list completion
export const useListCompletion = (listId: number) => {
  const { completeList, updateList } = useTodo();

  return {
    completeList: async () => await completeList(listId),
    uncompleteList: async () =>
      await updateList(listId, {
        isCompleted: false,
        completedAt: undefined,
      }),
  };
};
