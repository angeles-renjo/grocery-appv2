import { TodoStorage } from "../../utils/storage";
import { TodoList, TodoItem, ToastContextType } from "../../utils/types";
import { TodoAction } from "./TodoTypes";

export const createTodoActions = (
  dispatch: React.Dispatch<TodoAction>,
  storage: TodoStorage,
  toast: ToastContextType
) => ({
  loadLists: async () => {
    try {
      const lists = await storage.getLists();
      dispatch({ type: "SET_LISTS", payload: lists });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to load lists" });
      toast.showToast("Failed to load lists", "error");
    }
  },

  addList: async (title: string, dueDate: Date) => {
    try {
      // First create in storage to get the correct ID
      const newList = await storage.addList({ title, dueDate });

      // Then update state with the actual stored list
      dispatch({ type: "ADD_LIST", payload: newList });
      toast.showToast("List created successfully", "success");
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to add list" });
      toast.showToast("Failed to add list", "error");
      const lists = await storage.getLists();
      dispatch({ type: "SET_LISTS", payload: lists });
    }
  },

  updateList: async (listId: number, updates: Partial<TodoList>) => {
    try {
      // Update storage first
      await storage.updateList({ listId, updates });

      // Then update state
      dispatch({
        type: "UPDATE_LIST",
        payload: { listId, updates: { ...updates, updatedAt: new Date() } },
      });
      toast.showToast("List updated successfully", "success");
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to update list" });
      toast.showToast("Failed to update list", "error");
      const lists = await storage.getLists();
      dispatch({ type: "SET_LISTS", payload: lists });
    }
  },

  deleteList: async (listId: number) => {
    try {
      await storage.deleteList(listId);
      dispatch({ type: "DELETE_LIST", payload: listId });
      toast.showToast("List deleted successfully", "success");
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to delete list" });
      toast.showToast("Failed to delete list", "error");
      const lists = await storage.getLists();
      dispatch({ type: "SET_LISTS", payload: lists });
    }
  },

  addItem: async (listId: number, name: string) => {
    try {
      // First add to storage to get the correct ID
      const newItem = await storage.addItem({ listId, name });

      // Then update state with the actual stored item
      dispatch({
        type: "ADD_ITEM",
        payload: { listId, item: newItem },
      });
      toast.showToast("Item added successfully", "success");
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to add item" });
      toast.showToast("Failed to add item", "error");
      const lists = await storage.getLists();
      dispatch({ type: "SET_LISTS", payload: lists });
    }
  },

  updateItem: async (
    listId: number,
    itemId: number,
    updates: Partial<TodoItem>
  ) => {
    try {
      // Update storage first
      await storage.updateItem({ listId, itemId, updates });

      // Then update state
      dispatch({
        type: "UPDATE_ITEM",
        payload: {
          listId,
          itemId,
          updates: { ...updates, updatedAt: new Date() },
        },
      });
      toast.showToast("Item updated successfully", "success");
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to update item" });
      toast.showToast("Failed to update item", "error");
      const lists = await storage.getLists();
      dispatch({ type: "SET_LISTS", payload: lists });
    }
  },

  deleteItem: async (listId: number, itemId: number) => {
    try {
      await storage.deleteItem({ listId, itemId });
      dispatch({ type: "DELETE_ITEM", payload: { listId, itemId } });
      toast.showToast("Item deleted successfully", "success");
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to delete item" });
      toast.showToast("Failed to delete item", "error");
      const lists = await storage.getLists();
      dispatch({ type: "SET_LISTS", payload: lists });
    }
  },
});
