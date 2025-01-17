import { TodoStorage } from "../../utils/storage";
import { TodoList, TodoItem, ToastContextType } from "../../utils/types";
import { TodoAction } from "./TodoTypes";

type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

interface AddListParams {
  title: string;
  dueDate: Date;
  isCompleted?: boolean;
}

export const createTodoActions = (
  dispatch: React.Dispatch<TodoAction>,
  storage: TodoStorage,
  toast: ToastContextType
) => {
  // Generic error handler to reduce duplication
  const handleError = async (error: unknown, message: string) => {
    dispatch({ type: "SET_ERROR", payload: message });
    toast.showToast(message, "error");

    // Resync state with storage
    const lists = await storage.getLists();
    dispatch({ type: "SET_LISTS", payload: lists });
  };

  // Generic operation wrapper to handle common patterns
  const executeOperation = async <T>(
    operation: () => Promise<T>,
    successMessage: string,
    errorMessage: string
  ): Promise<ActionResult<T>> => {
    try {
      const result = await operation();
      toast.showToast(successMessage, "success");
      return { success: true, data: result };
    } catch (error) {
      await handleError(error, errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return {
    loadLists: async () => {
      const result = await executeOperation(
        async () => {
          const lists = await storage.getLists();
          dispatch({ type: "SET_LISTS", payload: lists });
          return lists;
        },
        "Lists loaded successfully",
        "Failed to load lists"
      );
      return result;
    },

    addList: async (title: string, dueDate: Date) => {
      const result = await executeOperation(
        async () => {
          const newList = await storage.addList({
            title,
            dueDate,
            isCompleted: false,
          } as AddListParams);
          dispatch({ type: "ADD_LIST", payload: newList });
          return newList;
        },
        "List created successfully",
        "Failed to add list"
      );
      return result;
    },

    updateList: async (listId: number, updates: Partial<TodoList>) => {
      const result = await executeOperation(
        async () => {
          const updatedList = {
            ...updates,
            updatedAt: new Date(),
            ...(updates.isCompleted && { completedAt: new Date() }),
          };
          await storage.updateList({ listId, updates: updatedList });
          dispatch({
            type: "UPDATE_LIST",
            payload: { listId, updates: updatedList },
          });
          return updatedList;
        },
        updates.isCompleted ? "List completed" : "List updated successfully",
        "Failed to update list"
      );
      return result;
    },

    deleteList: async (listId: number) => {
      const result = await executeOperation(
        async () => {
          await storage.deleteList(listId);
          dispatch({ type: "DELETE_LIST", payload: listId });
          return listId;
        },
        "List deleted successfully",
        "Failed to delete list"
      );
      return result;
    },

    addItem: async (
      listId: number,
      name: string,
      initialData?: Partial<
        Omit<TodoItem, "itemId" | "createdAt" | "updatedAt">
      >
    ) => {
      const result = await executeOperation(
        async () => {
          const newItem = await storage.addItem({
            listId,
            name,
            price: initialData?.price,
            quantity: initialData?.quantity,
          });

          dispatch({
            type: "ADD_ITEM",
            payload: { listId, item: newItem },
          });
          return newItem;
        },
        "Item added successfully",
        "Failed to add item"
      );
      return result;
    },

    updateItem: async (
      listId: number,
      itemId: number,
      updates: Partial<TodoItem>
    ) => {
      const result = await executeOperation(
        async () => {
          const sanitizedUpdates = {
            ...updates,
            quantity:
              updates.quantity && updates.quantity < 1 ? 1 : updates.quantity,
            updatedAt: new Date(),
          };

          await storage.updateItem({
            listId,
            itemId,
            updates: sanitizedUpdates,
          });

          dispatch({
            type: "UPDATE_ITEM",
            payload: {
              listId,
              itemId,
              updates: sanitizedUpdates,
            },
          });
          return sanitizedUpdates;
        },
        "Item updated successfully",
        "Failed to update item"
      );
      return result;
    },

    deleteItem: async (listId: number, itemId: number) => {
      const result = await executeOperation(
        async () => {
          await storage.deleteItem({ listId, itemId });
          dispatch({
            type: "DELETE_ITEM",
            payload: { listId, itemId },
          });
          return { listId, itemId };
        },
        "Item deleted successfully",
        "Failed to delete item"
      );
      return result;
    },
  };
};
